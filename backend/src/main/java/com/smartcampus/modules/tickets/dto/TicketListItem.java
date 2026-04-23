package com.smartcampus.modules.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO returned when listing the current user's tickets.
 * Contains all fields needed to render both the "My Tickets" list and the
 * ticket detail panel.
 **/
@Data
@Builder
public class TicketListItem {
    private Long ticketId;
    private String title;
    private String description;
    private String priority;
    private String status;
    private String contact;

    // Asset / location info
    private Long assetId;
    private String assetName;
    private String locationName;

    private String reportedByName;
    private LocalDateTime createdAt;
    private String rejectionReason;
    private String resolutionNotes;
    private List<String> attachmentUrls;
}
