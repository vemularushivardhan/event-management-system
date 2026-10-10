package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.RegistrationResponse;
import com.example.eventmanagement.entity.Role;
import com.example.eventmanagement.security.CustomUserDetails;
import com.example.eventmanagement.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<RegistrationResponse> registerForEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        RegistrationResponse response = registrationService.registerForEvent(eventId, userDetails.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<RegistrationResponse> list = registrationService.getUserRegistrations(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistrationResponse> getRegistrationById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isAdmin = userDetails.getRole() == Role.ADMIN;
        RegistrationResponse response = registrationService.getRegistrationById(id, userDetails.getId(), isAdmin);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RegistrationResponse> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isAdmin = userDetails.getRole() == Role.ADMIN;
        RegistrationResponse response = registrationService.cancelRegistration(id, userDetails.getId(), isAdmin);
        return ResponseEntity.ok(response);
    }
}
