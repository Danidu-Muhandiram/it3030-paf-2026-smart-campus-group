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
    private LocalDateTime createdAt;
    private String rejectionReason;
    private List<String> attachmentUrls;
}
