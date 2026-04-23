package com.smartcampus.modules.facilities.dto;

/**
 * One availability slot returned by GET /api/assets/{id}/availability
 *
 * @param startTime    "HH:mm"
 * @param endTime      "HH:mm"
 * @param booked       true when an APPROVED/PENDING booking occupies this slot
 * @param status       "APPROVED", "PENDING", or null when free
 * @param purpose      non-null only when booked == true
 * @param requestedBy  full name of the requester, non-null only when booked == true
 */
public record AvailabilitySlotResponse(
        String startTime,
        String endTime,
        boolean booked,
        String status,
        String purpose,
        String requestedBy
) {}
