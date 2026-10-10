package com.example.eventmanagement.service;

import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.entity.*;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ConflictException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final QrCodeService qrCodeService;

    public AdminService(RegistrationRepository registrationRepository,
                        EventRepository eventRepository,
                        UserRepository userRepository,
                        QrCodeService qrCodeService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.qrCodeService = qrCodeService;
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAllRegistrations(Long eventId,
                                                         RegistrationStatus regStatus,
                                                         AttendanceStatus attStatus,
                                                         String query) {
        List<Registration> list = registrationRepository.filterRegistrations(eventId, regStatus, attStatus, query);
        return list.stream()
                .map(reg -> {
                    String qrCode = qrCodeService.generateQrCodeBase64(reg.getQrToken());
                    return RegistrationResponse.fromEntity(reg, qrCode);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getEventRegistrations(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }
        List<Registration> list = registrationRepository.findByEventIdOrderByRegistrationDateDesc(eventId);
        return list.stream()
                .map(reg -> {
                    String qrCode = qrCodeService.generateQrCodeBase64(reg.getQrToken());
                    return RegistrationResponse.fromEntity(reg, qrCode);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllParticipants(String query) {
        List<User> users;
        if (query != null && !query.trim().isEmpty()) {
            users = userRepository.searchParticipants(Role.USER, query.trim());
        } else {
            users = userRepository.findByRole(Role.USER);
        }

        return users.stream()
                .map(user -> {
                    UserResponse resp = UserResponse.fromEntity(user);
                    long count = registrationRepository.findByUserIdOrderByRegistrationDateDesc(user.getId()).size();
                    resp.setRegisteredEventsCount(count);
                    return resp;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalEvents = eventRepository.count();
        long totalParticipants = userRepository.countByRole(Role.USER);
        long totalAttendance = registrationRepository.countByAttendanceStatus(AttendanceStatus.ATTENDED);
        long upcomingEvents = eventRepository.countByEventDateGreaterThanEqual(LocalDate.now());
        long confirmedRegistrations = registrationRepository.countByRegistrationStatus(RegistrationStatus.CONFIRMED);

        double attendanceRate = (confirmedRegistrations > 0)
                ? Math.round(((double) totalAttendance / confirmedRegistrations) * 10000.0) / 100.0
                : 0.0;

        return new DashboardStatsResponse(
                totalEvents,
                totalParticipants,
                totalAttendance,
                upcomingEvents,
                attendanceRate
        );
    }

    @Transactional(readOnly = true)
    public List<EventReportResponse> getAttendanceReports() {
        List<Event> events = eventRepository.findAll();
        Map<Long, Long> regMap = registrationRepository.countConfirmedRegistrationsPerEvent(RegistrationStatus.CONFIRMED)
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        Map<Long, Long> attMap = registrationRepository.countAttendedPerEvent(AttendanceStatus.ATTENDED)
                .stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        return events.stream()
                .map(event -> {
                    long totalReg = regMap.getOrDefault(event.getId(), 0L);
                    long totalAtt = attMap.getOrDefault(event.getId(), 0L);
                    return new EventReportResponse(
                            event.getId(),
                            event.getEventName(),
                            event.getEventDate(),
                            event.getCapacity(),
                            totalReg,
                            totalAtt
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceCheckInResponse checkInAttendance(String qrToken) {
        if (qrToken == null || qrToken.trim().isEmpty()) {
            throw new BadRequestException("QR Token cannot be blank.");
        }

        String cleanToken = qrToken.trim();
        Registration registration = registrationRepository.findByQrToken(cleanToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid QR Code: No registration found matching token '" + cleanToken + "'."));

        if (registration.getRegistrationStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Cannot check in: This registration was previously cancelled.");
        }

        if (registration.getAttendanceStatus() == AttendanceStatus.ATTENDED) {
            throw new ConflictException("Duplicate check-in prevented: Participant '" +
                    registration.getUser().getName() + "' was already checked in at " +
                    registration.getCheckInTime() + ".");
        }

        // Mark attended and record timestamp
        registration.setAttendanceStatus(AttendanceStatus.ATTENDED);
        registration.setCheckInTime(LocalDateTime.now());
        Registration saved = registrationRepository.save(registration);

        String qrCode = qrCodeService.generateQrCodeBase64(saved.getQrToken());
        RegistrationResponse regResp = RegistrationResponse.fromEntity(saved, qrCode);

        return new AttendanceCheckInResponse(
                true,
                "Check-in verified successfully for participant '" + saved.getUser().getName() +
                        "' at event '" + saved.getEvent().getEventName() + "'.",
                regResp
        );
    }
}
