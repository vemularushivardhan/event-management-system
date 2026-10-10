package com.example.eventmanagement.service;

import com.example.eventmanagement.dto.RegistrationResponse;
import com.example.eventmanagement.entity.*;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ConflictException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final QrCodeService qrCodeService;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository,
                               QrCodeService qrCodeService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.qrCodeService = qrCodeService;
    }

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // 1. Prevent duplicate registrations for the same event by the same user
        boolean alreadyRegistered = registrationRepository.existsByUserIdAndEventIdAndRegistrationStatus(
                userId, eventId, RegistrationStatus.CONFIRMED);
        if (alreadyRegistered) {
            throw new ConflictException("You have already registered for this event.");
        }

        // 2. Prevent registrations when an event is full
        long confirmedCount = registrationRepository.countByEventIdAndRegistrationStatus(eventId, RegistrationStatus.CONFIRMED);
        if (confirmedCount >= event.getCapacity()) {
            throw new BadRequestException("Event is fully booked. No seats remaining.");
        }

        // 3. Generate unique, unpredictable QR token
        String qrToken = qrCodeService.generateUniqueQrToken(eventId, userId);

        Registration registration = new Registration(user, event, qrToken);
        Registration saved = registrationRepository.save(registration);

        String qrCodeBase64 = qrCodeService.generateQrCodeBase64(saved.getQrToken());
        return RegistrationResponse.fromEntity(saved, qrCodeBase64);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getUserRegistrations(Long userId) {
        List<Registration> list = registrationRepository.findByUserIdOrderByRegistrationDateDesc(userId);
        return list.stream()
                .map(reg -> {
                    String qrCode = qrCodeService.generateQrCodeBase64(reg.getQrToken());
                    return RegistrationResponse.fromEntity(reg, qrCode);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RegistrationResponse getRegistrationById(Long registrationId, Long currentUserId, boolean isAdmin) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (!isAdmin && !registration.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to view this registration.");
        }

        String qrCode = qrCodeService.generateQrCodeBase64(registration.getQrToken());
        return RegistrationResponse.fromEntity(registration, qrCode);
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long registrationId, Long currentUserId, boolean isAdmin) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (!isAdmin && !registration.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to cancel this registration.");
        }

        if (registration.getRegistrationStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("This registration is already cancelled.");
        }

        if (registration.getAttendanceStatus() == AttendanceStatus.ATTENDED) {
            throw new BadRequestException("Cannot cancel a registration that has already been marked as attended.");
        }

        registration.setRegistrationStatus(RegistrationStatus.CANCELLED);
        Registration saved = registrationRepository.save(registration);

        String qrCode = qrCodeService.generateQrCodeBase64(saved.getQrToken());
        return RegistrationResponse.fromEntity(saved, qrCode);
    }
}
