package com.smartcampus.modules.facilities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LocationRequest {

    @NotBlank(message = "Location name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String buildingName;

    private Integer floorNo;
}
