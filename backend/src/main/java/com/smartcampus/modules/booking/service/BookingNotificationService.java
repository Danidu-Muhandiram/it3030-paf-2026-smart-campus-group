package com.smartcampus.modules.booking.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.smartcampus.config.MailProperties;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.booking.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingNotificationService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    public void sendApprovalEmail(Booking booking) {
        if (!canSendMail(booking)) {
            throw new IllegalStateException("Booking email is not configured correctly");
        }

        try {
            byte[] qrCode = generateQrCode(buildVerificationPayload(booking));
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(booking.getUser().getEmail());
            helper.setFrom(mailProperties.from(), mailProperties.fromName());
            helper.setSubject("Booking Approved - " + booking.getResourceName());
            helper.setText(buildApprovalHtml(booking), true);
            helper.addInline("bookingQr", new ByteArrayResource(qrCode), "image/png");

            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send booking approval email for booking {}", booking.getId(), ex);
            throw new IllegalStateException(
                    "Failed to send approval email. Please verify the mail configuration and try again.");
        }
    }

    public void sendRejectionEmail(Booking booking) {
        if (!canSendMail(booking)) {
            throw new IllegalStateException("Booking email is not configured correctly");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setTo(booking.getUser().getEmail());
            helper.setFrom(mailProperties.from(), mailProperties.fromName());
            helper.setSubject("Booking Update - " + booking.getResourceName());
            helper.setText(buildRejectionHtml(booking), true);

            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send booking rejection email for booking {}", booking.getId(), ex);
            throw new IllegalStateException(
                    "Failed to send rejection email. Please verify the mail configuration and try again.");
        }
    }

    public void resendStatusEmail(Booking booking) {
        if (booking.getStatus() == null) {
            throw new IllegalStateException("Booking status is not available for email delivery");
        }
        switch (booking.getStatus()) {
            case APPROVED -> sendApprovalEmail(booking);
            case REJECTED -> sendRejectionEmail(booking);
            default -> throw new IllegalStateException("Only approved or rejected bookings can resend status emails");
        }
    }

    private boolean canSendMail(Booking booking) {
        if (!mailProperties.enabled()) {
            log.warn("Booking mail sending is disabled via app.mail.enabled");
            return false;
        }
        User user = booking.getUser();
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Booking {} has no recipient email", booking.getId());
            return false;
        }
        if (mailProperties.from() == null || mailProperties.from().isBlank()) {
            log.warn("Booking mail is enabled, but app.mail.from is not configured");
            return false;
        }
        return true;
    }

    private byte[] generateQrCode(String contents) throws Exception {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());
        BitMatrix matrix = new MultiFormatWriter().encode(contents, BarcodeFormat.QR_CODE, 320, 320, hints);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", output);
        return output.toByteArray();
    }

    private String buildVerificationPayload(Booking booking) {
        return """
                SMART_CAMPUS_BOOKING
                bookingId=%d
                userEmail=%s
                resource=%s
                date=%s
                start=%s
                end=%s
                status=%s
                reviewedAt=%s
                """.formatted(
                booking.getId(),
                safe(booking.getUser() != null ? booking.getUser().getEmail() : null),
                safe(booking.getResourceName()),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getReviewedAt());
    }

    private String buildApprovalHtml(Booking booking) {
        String userName = getDisplayName(booking.getUser());
        String reviewer = booking.getReviewedBy() == null ? "Smart Campus Admin"
                : getDisplayName(booking.getReviewedBy());

        return """
                <html>
                <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                  <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
                    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                      <div style="background:linear-gradient(135deg,#0f766e,#2563eb);padding:32px;color:#ffffff;">
                        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;">Smart Campus</div>
                        <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">Your booking has been approved</h1>
                        <p style="margin:12px 0 0;font-size:15px;line-height:1.7;opacity:0.95;">Please keep this email for entry or verification. The QR code below can be used to confirm the approved reservation.</p>
                      </div>
                      <div style="padding:32px;">
                        <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">Dear %s,</p>
                        <p style="margin:0 0 24px;font-size:15px;line-height:1.8;">Your booking request for <strong>%s</strong> has been approved by %s.</p>
                        <div style="border:1px solid #dbe4f0;border-radius:16px;padding:20px;background:#f8fbff;">
                          <div style="font-size:14px;line-height:2;">
                            <div><strong>Booking ID:</strong> #%d</div>
                            <div><strong>Date:</strong> %s</div>
                            <div><strong>Time:</strong> %s - %s</div>
                            <div><strong>Purpose:</strong> %s</div>
                            <div><strong>Expected attendees:</strong> %d</div>
                          </div>
                        </div>
                        <div style="text-align:center;padding:28px 0 12px;">
                          <img src="cid:bookingQr" alt="Booking QR Code" style="width:220px;height:220px;border:12px solid #ffffff;box-shadow:0 6px 20px rgba(15,23,42,0.12);border-radius:18px;" />
                          <p style="margin:16px 0 0;font-size:14px;color:#475569;line-height:1.7;">Present this QR code if verification is required at the venue.</p>
                        </div>
                        <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#475569;">If your plans change, please reschedule or cancel the booking from the Smart Campus system as early as possible.</p>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                """
                .formatted(
                        escapeHtml(userName),
                        escapeHtml(booking.getResourceName()),
                        escapeHtml(reviewer),
                        booking.getId(),
                        booking.getBookingDate().format(DATE_FORMAT),
                        booking.getStartTime().format(TIME_FORMAT),
                        booking.getEndTime().format(TIME_FORMAT),
                        escapeHtml(booking.getPurpose()),
                        booking.getExpectedAttendees());
    }

    private String buildRejectionHtml(Booking booking) {
        String userName = getDisplayName(booking.getUser());

        return """
                <html>
                <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                  <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
                    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                      <div style="background:linear-gradient(135deg,#991b1b,#ea580c);padding:32px;color:#ffffff;">
                        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;">Smart Campus</div>
                        <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">Your booking request was not approved</h1>
                        <p style="margin:12px 0 0;font-size:15px;line-height:1.7;opacity:0.95;">The request has been reviewed by the administration team. The reason is included below so you can adjust and submit again if needed.</p>
                      </div>
                      <div style="padding:32px;">
                        <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">Dear %s,</p>
                        <p style="margin:0 0 24px;font-size:15px;line-height:1.8;">We are sorry, but your booking request for <strong>%s</strong> on %s from %s to %s was rejected.</p>
                        <div style="border-left:5px solid #dc2626;background:#fff7f7;padding:18px 20px;border-radius:12px;">
                          <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#b91c1c;margin-bottom:8px;"><strong>Reason</strong></div>
                          <div style="font-size:15px;line-height:1.8;color:#7f1d1d;">%s</div>
                        </div>
                        <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#475569;">You may submit a new request or reschedule with a different slot if the resource becomes available.</p>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                """
                .formatted(
                        escapeHtml(userName),
                        escapeHtml(booking.getResourceName()),
                        booking.getBookingDate().format(DATE_FORMAT),
                        booking.getStartTime().format(TIME_FORMAT),
                        booking.getEndTime().format(TIME_FORMAT),
                        escapeHtml(safe(booking.getRejectionReason())));
    }

    private String getDisplayName(User user) {
        if (user == null) {
            return "User";
        }
        String first = safe(user.getFirstName());
        String last = safe(user.getLastName());
        String fullName = (first + " " + last).trim();
        return fullName.isBlank() ? safe(user.getEmail()) : fullName;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String escapeHtml(String value) {
        return safe(value)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
