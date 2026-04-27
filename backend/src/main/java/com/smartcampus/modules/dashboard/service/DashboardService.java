package com.smartcampus.modules.dashboard.service;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.booking.repository.BookingRepository;
import com.smartcampus.modules.dashboard.dto.DashboardSummaryResponse;
import com.smartcampus.modules.facilities.repository.AssetRepository;
import com.smartcampus.modules.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AssetRepository assetRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getUserDashboardSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalResources = assetRepository.count();
        long myBookings = bookingRepository.countByUser(user);
        long openTickets = ticketRepository.countByReportedByEmailAndStatus(email, "OPEN");

        return DashboardSummaryResponse.builder()
                .totalResources(totalResources)
                .myBookings(myBookings)
                .openTickets(openTickets)
                .build();
    }
}
