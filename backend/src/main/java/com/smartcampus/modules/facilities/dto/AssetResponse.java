package com.smartcampus.modules.facilities.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponse {
    private Long id;
    private String name;
    private String type;
    private String status;
    private Integer capacity;
    private String imageUrl;
    private LocationResponse location;
}
