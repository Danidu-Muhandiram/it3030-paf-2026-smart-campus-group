package com.smartcampus.modules.tickets.dto;

import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    private String status;
    private String rejectionReason;
}
