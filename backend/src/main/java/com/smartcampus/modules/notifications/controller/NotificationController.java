package com.smartcampus.modules.notifications.controller;

import com.smartcampus.modules.notifications.dto.NotificationResponse;
import com.smartcampus.modules.notifications.service.NotificationService;
import com.smartcampus.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal String email) {
        log.info("Fetching notifications for user: {}", email);
        try {
            List<NotificationResponse> notifications = notificationService.getMyNotifications(email);
            log.info("Found {} notifications", notifications.size());
            return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching notifications", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal String email) {
        log.info("Fetching unread count for user: {}", email);
        try {
            long count = notificationService.getUnreadCount(email);
            log.info("Unread count: {}", count);
            return ResponseEntity.ok(new ApiResponse<>(true, "Unread count fetched", count));
        } catch (Exception e) {
            log.error("Error fetching unread count", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        try {
            notificationService.markAsRead(id, email);
            return ResponseEntity.ok(new ApiResponse<>(true, "Marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal String email) {
        try {
            notificationService.markAllAsRead(email);
            return ResponseEntity.ok(new ApiResponse<>(true, "All marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
