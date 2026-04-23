package com.smartcampus.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentRequest {

    @NotBlank(message = "Comment is required")
    @Size(max = 2000, message = "Comment cannot exceed 2000 characters")
    private String comment;
}
