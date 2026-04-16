package com.smartcampus.modules.facilities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AssetRequest {

    @NotBlank(message = "Asset name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Asset type is required")
    @Size(max = 50)
    private String type;

    @NotBlank(message = "Status is required")
    private String status;

    @Positive(message = "Capacity must be a positive number")
    private Integer capacity;

    @NotNull(message = "Location is required")
    private Long locationId;
}
