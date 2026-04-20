package com.smartcampus.modules.tickets.controller;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.tickets.dto.TicketListItem;
import com.smartcampus.modules.tickets.dto.TicketResponse;
import com.smartcampus.modules.tickets.service.TicketService;
import com.smartcampus.shared.dto.ApiResponse;
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
}
