package com.smartcampus.modules.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketCommentResponse {
    private Long commentId;
    private Long ticketId;
    private String authorName;
    private String authorEmail;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
