package com.smartcampus.modules.facilities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResourceTypeRequest {

    @NotBlank(message = "Type name is required")
    @Size(max = 100)
    private String name;
}
