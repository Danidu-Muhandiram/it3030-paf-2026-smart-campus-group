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

    @NotNull(message = "Asset type is required")
    private Long typeId;

    @NotBlank(message = "Status is required")
    private String status;

    @Positive(message = "Capacity must be greater than 0")
    private Integer capacity;

    @NotNull(message = "Location is required")
    private Long locationId;

    /** Optional — set after uploading via POST /api/uploads/image */
    private String imageUrl;
}
