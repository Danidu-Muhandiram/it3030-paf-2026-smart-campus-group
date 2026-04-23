package com.smartcampus.modules.facilities.controller;

import com.smartcampus.modules.facilities.dto.AssetRequest;
import com.smartcampus.modules.facilities.dto.AssetResponse;
import com.smartcampus.modules.facilities.dto.AvailabilitySlotResponse;
import com.smartcampus.modules.facilities.entity.Booking;
import com.smartcampus.modules.facilities.repository.BookingRepository;
import com.smartcampus.modules.facilities.service.AssetService;
import com.smartcampus.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    /** Operating hours: 08:00 – 22:00, split into 1-hour slots */
    private static final LocalTime DAY_START = LocalTime.of(8, 0);
    private static final LocalTime DAY_END   = LocalTime.of(22, 0);

    private final AssetService assetService;
    private final BookingRepository bookingRepository;

    public AssetController(AssetService assetService, BookingRepository bookingRepository) {
        this.assetService       = assetService;
        this.bookingRepository  = bookingRepository;
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

    /**
     * GET /api/assets/{id}/availability?date=YYYY-MM-DD
     *
     * Returns hourly slots for the given asset and date.
     * Each slot is marked as booked (APPROVED or PENDING booking exists) or free.
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<List<AvailabilitySlotResponse>>> getAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<Booking> bookings = bookingRepository.findActiveByAssetAndDate(id, date);

        List<AvailabilitySlotResponse> slots = new ArrayList<>();
        LocalTime cursor = DAY_START;

        while (cursor.isBefore(DAY_END)) {
            LocalTime slotEnd = cursor.plusHours(1);
            final LocalTime slotStart = cursor;

            // A booking overlaps this hour-block if it starts before slotEnd and ends after slotStart
            Booking overlap = bookings.stream()
                    .filter(b -> b.getStartTime().isBefore(slotEnd) && b.getEndTime().isAfter(slotStart))
                    .findFirst()
                    .orElse(null);

            String requesterName = null;
            if (overlap != null && overlap.getRequestedBy() != null) {
                var u = overlap.getRequestedBy();
                requesterName = (u.getFirstName() + " " + u.getLastName()).trim();
            }
            slots.add(new AvailabilitySlotResponse(
                    slotStart.format(TIME_FMT),
                    slotEnd.format(TIME_FMT),
                    overlap != null,
                    overlap != null ? overlap.getStatus() : null,
                    overlap != null ? overlap.getPurpose() : null,
                    requesterName
            ));

            cursor = slotEnd;
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Availability fetched", slots));
    }
}
