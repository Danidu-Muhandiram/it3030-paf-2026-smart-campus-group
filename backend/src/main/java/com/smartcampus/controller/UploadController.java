package com.smartcampus.controller;

import com.smartcampus.shared.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final java.util.Set<String> ALLOWED_TYPES = java.util.Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    /**
     * Upload an image file and return the accessible URL path.
     * POST /api/uploads/image  (multipart, field name: "file")
     */
    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "No file provided", null));
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Only JPEG, PNG, WebP, or GIF images are allowed", null));
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "File size must be under 5 MB", null));
        }

        // Ensure the upload directory exists
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        Files.createDirectories(uploadPath);

        // Generate a unique filename to avoid collisions
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        // Save the file
        Path destination = uploadPath.resolve(filename);
        file.transferTo(destination);

        // Return the relative URL — served by UploadConfig resource handler
        String url = "/uploads/" + filename;
        return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded", Map.of("url", url)));
    }
}
