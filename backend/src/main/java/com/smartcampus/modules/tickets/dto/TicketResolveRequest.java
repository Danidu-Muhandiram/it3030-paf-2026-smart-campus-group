package com.smartcampus.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketResolveRequest {

    @NotBlank(message = "resolutionNotes is required")
    private String resolutionNotes;
}
