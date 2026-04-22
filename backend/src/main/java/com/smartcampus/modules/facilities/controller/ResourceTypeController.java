package com.smartcampus.modules.facilities.controller;

import com.smartcampus.modules.facilities.dto.ResourceTypeRequest;
import com.smartcampus.modules.facilities.dto.ResourceTypeResponse;
import com.smartcampus.modules.facilities.service.ResourceTypeService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource-types")
public class ResourceTypeController {

    private final ResourceTypeService resourceTypeService;

    public ResourceTypeController(ResourceTypeService resourceTypeService) {
        this.resourceTypeService = resourceTypeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceTypeResponse>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource types fetched", resourceTypeService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceTypeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource type fetched", resourceTypeService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceTypeResponse>> create(@Valid @RequestBody ResourceTypeRequest request) {
        ResourceTypeResponse created = resourceTypeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Resource type created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceTypeResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ResourceTypeRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource type updated", resourceTypeService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        resourceTypeService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resource type deleted", null));
    }
}
