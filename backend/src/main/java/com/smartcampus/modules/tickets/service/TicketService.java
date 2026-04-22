package com.smartcampus.modules.tickets.service;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.facilities.entity.Asset;
import com.smartcampus.modules.facilities.repository.AssetRepository;
import com.smartcampus.modules.tickets.dto.TicketCommentResponse;
import com.smartcampus.modules.tickets.dto.TicketListItem;
import com.smartcampus.modules.tickets.dto.TicketResponse;
import com.smartcampus.modules.tickets.entity.Ticket;
import com.smartcampus.modules.tickets.entity.TicketAttachment;
import com.smartcampus.modules.tickets.entity.TicketComment;
import com.smartcampus.modules.tickets.repository.TicketCommentRepository;
import com.smartcampus.modules.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
        private final TicketCommentRepository ticketCommentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Transactional
    public TicketResponse createTicket(String email, String title, String description, String priority,
                                       Long assetId, String contact, MultipartFile[] files) {

        User reportedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Ticket ticket = Ticket.builder()
                .reportedBy(reportedBy)
                .asset(asset)
                .title(title)
                .description(description)
                .priority(priority == null ? "MEDIUM" : priority.toUpperCase())
                .contact(contact)
                .status("OPEN")
                .attachments(new ArrayList<>())
                .build();

        if (files != null && files.length > 0) {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                log.error("Could not create upload directory", e);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String originalFilename = file.getOriginalFilename();
                String extension = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                        : "";
                String filename = UUID.randomUUID() + extension;

                try {
                    Path destination = uploadPath.resolve(filename);
                    file.transferTo(destination);

                    TicketAttachment attachment = TicketAttachment.builder()
                            .ticket(ticket)
                            .fileName(originalFilename)
                            .filePath("/uploads/" + filename)
                            .fileType(file.getContentType())
                            .uploadedBy(reportedBy)
                            .build();

                    ticket.getAttachments().add(attachment);
                } catch (IOException e) {
                    log.error("Failed to store file: " + originalFilename, e);
                }
            }
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        return TicketResponse.builder()
                .ticketId(savedTicket.getId())
                .title(savedTicket.getTitle())
                .description(savedTicket.getDescription())
                .priority(savedTicket.getPriority())
                .status(savedTicket.getStatus())
                .contact(savedTicket.getContact())
                .assetId(asset.getId())
                .assetName(asset.getName())
                .reportedByName(reportedBy.getFirstName() + " " + reportedBy.getLastName())
                .createdAt(savedTicket.getCreatedAt())
                .attachmentUrls(savedTicket.getAttachments().stream()
                        .map(TicketAttachment::getFilePath)
                        .collect(Collectors.toList()))
                .build();
    }

    /**
     * Returns all tickets submitted by the given user, newest first.
     */
    @Transactional(readOnly = true)
    public List<TicketListItem> getMyTickets(String email) {
        return ticketRepository.findByReportedByEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(ticket -> {
                    String locationName = (ticket.getAsset() != null
                            && ticket.getAsset().getLocation() != null)
                            ? ticket.getAsset().getLocation().getName()
                            : "";
                    String assetName = ticket.getAsset() != null ? ticket.getAsset().getName() : "";
                    Long assetId = ticket.getAsset() != null ? ticket.getAsset().getId() : null;

                    return TicketListItem.builder()
                            .ticketId(ticket.getId())
                            .title(ticket.getTitle())
                            .description(ticket.getDescription())
                            .priority(ticket.getPriority())
                            .status(ticket.getStatus())
                            .contact(ticket.getContact())
                            .assetId(assetId)
                            .assetName(assetName)
                            .locationName(locationName)
                            .reportedByName(
                                    ticket.getReportedBy().getFirstName() + " " + ticket.getReportedBy().getLastName())
                            .createdAt(ticket.getCreatedAt())
                            .attachmentUrls(ticket.getAttachments().stream()
                                    .map(TicketAttachment::getFilePath)
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketCommentResponse> getTicketComments(String email, Long ticketId) {
                // only expose comments on tickets owned by the logged-in user.
        Ticket ticket = getAccessibleTicket(ticketId, email);

                // Oldest to newest keeps the thread natural in the UI.
        return ticketCommentRepository.findByTicket_IdOrderByCreatedAtAsc(ticket.getId())
                .stream()
                .map(this::toTicketCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketCommentResponse addComment(String email, Long ticketId, String commentText) {
        User commentedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Reuse same access rule for reads and writes.
        Ticket ticket = getAccessibleTicket(ticketId, email);

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .commentedBy(commentedBy)
                .commentText(commentText.trim())
                .build();

        TicketComment savedComment = ticketCommentRepository.save(comment);
        return toTicketCommentResponse(savedComment);
    }

    private Ticket getAccessibleTicket(Long ticketId, String email) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

                // For now, comments are scoped to the ticket reporter only.
        String ownerEmail = ticket.getReportedBy() != null ? ticket.getReportedBy().getEmail() : null;
        if (ownerEmail == null || !ownerEmail.equalsIgnoreCase(email)) {
            throw new RuntimeException("You do not have access to this ticket");
        }

        return ticket;
    }

    private TicketCommentResponse toTicketCommentResponse(TicketComment comment) {
        String authorName = "Unknown User";
        if (comment.getCommentedBy() != null) {
            String firstName = comment.getCommentedBy().getFirstName() == null
                    ? ""
                    : comment.getCommentedBy().getFirstName();
            String lastName = comment.getCommentedBy().getLastName() == null
                    ? ""
                    : comment.getCommentedBy().getLastName();
            String fullName = (firstName + " " + lastName).trim();
            // If profile names are missing, email is still better than a blank author.
            authorName = fullName.isBlank()
                    ? comment.getCommentedBy().getEmail()
                    : fullName;
        }

        return TicketCommentResponse.builder()
                .commentId(comment.getId())
                .ticketId(comment.getTicket().getId())
                .authorName(authorName)
                .comment(comment.getCommentText())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
