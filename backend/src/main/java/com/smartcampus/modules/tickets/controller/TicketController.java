package com.smartcampus.modules.tickets.controller;

import com.smartcampus.modules.tickets.dto.TicketCommentRequest;
import com.smartcampus.modules.tickets.dto.TicketCommentResponse;
import com.smartcampus.modules.tickets.dto.TicketListItem;
import com.smartcampus.modules.tickets.dto.TicketResponse;
import com.smartcampus.modules.tickets.service.TicketService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @AuthenticationPrincipal String email, 
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("priority") String priority,
            @RequestParam("assetId") Long assetId,
            @RequestParam(value = "contact", required = false) String contact,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        try {
            TicketResponse response = ticketService.createTicket(email, title, description, priority, assetId, contact, files);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketListItem>>> getMyTickets(
            @AuthenticationPrincipal String email) {
        try {
            List<TicketListItem> tickets = ticketService.getMyTickets(email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tickets fetched successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<ApiResponse<List<TicketCommentResponse>>> getTicketComments(
            @AuthenticationPrincipal String email,
            @PathVariable Long ticketId) {
        try {
            List<TicketCommentResponse> comments = ticketService.getTicketComments(email, ticketId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comments fetched successfully", comments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<ApiResponse<TicketCommentResponse>> addTicketComment(
            @AuthenticationPrincipal String email,
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketCommentRequest request) {
        try {
            TicketCommentResponse comment = ticketService.addComment(email, ticketId, request.getComment());
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment added successfully", comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<TicketCommentResponse>> updateTicketComment(
            @AuthenticationPrincipal String email,
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @Valid @RequestBody TicketCommentRequest request) {
        try {
            TicketCommentResponse comment = ticketService.updateComment(email, ticketId, commentId, request.getComment());
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment updated successfully", comment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteTicketComment(
            @AuthenticationPrincipal String email,
            @PathVariable Long ticketId,
            @PathVariable Long commentId) {
        try {
            ticketService.deleteComment(email, ticketId, commentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // Admin Endpoints

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<TicketListItem>>> getAllTicketsAdmin() {
        try {
            List<TicketListItem> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(new ApiResponse<>(true, "All tickets fetched successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/admin/{ticketId}/status")
    public ResponseEntity<ApiResponse<TicketListItem>> updateTicketStatus(
            @PathVariable Long ticketId,
            @Valid @RequestBody com.smartcampus.modules.tickets.dto.TicketStatusUpdateRequest request) {
        try {
            TicketListItem ticket = ticketService.updateTicketStatus(
                    ticketId, 
                    request.getStatus(), 
                    null, 
                    request.getRejectionReason()
            );
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket status updated successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
