package com.smartcampus.modules.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TicketResponse {
    private Long ticketId; // Matched with frontend requirement
    private String title;
    private String description;
    private String priority;
    private String status;
    private String contact;
    private Long assetId;
    private String assetName;
    private String reportedByName;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private String rejectionReason;
    private String resolutionNotes;
    private List<String> attachmentUrls;
}
