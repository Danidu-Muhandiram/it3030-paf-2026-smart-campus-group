package com.smartcampus.modules.facilities.controller;

import com.smartcampus.modules.facilities.dto.AssetRequest;
import com.smartcampus.modules.facilities.dto.AssetResponse;
import com.smartcampus.modules.facilities.service.AssetService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Assets fetched", assetService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset fetched", assetService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponse>> create(@Valid @RequestBody AssetRequest request) {
        AssetResponse created = assetService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Asset created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset updated", assetService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        assetService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset deleted", null));
    }
}
