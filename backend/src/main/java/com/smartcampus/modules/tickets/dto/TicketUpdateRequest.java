package com.smartcampus.modules.tickets.dto;

import lombok.Data;

@Data
public class TicketUpdateRequest {
    private String title;
    private String description;
    private String priority;
    private Long assetId;
    private String contact;
}
