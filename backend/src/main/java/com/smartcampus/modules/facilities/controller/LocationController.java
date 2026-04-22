package com.smartcampus.modules.facilities.controller;

import com.smartcampus.modules.facilities.dto.LocationRequest;
import com.smartcampus.modules.facilities.dto.LocationResponse;
import com.smartcampus.modules.facilities.service.LocationService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Locations fetched", locationService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LocationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Location fetched", locationService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LocationResponse>> create(@Valid @RequestBody LocationRequest request) {
        LocationResponse created = locationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Location created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LocationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Location updated", locationService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        locationService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Location deleted", null));
    }
}
