package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.entity.AttendanceStatus;
import com.example.eventmanagement.entity.RegistrationStatus;
import com.example.eventmanagement.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<RegistrationResponse>> getAllRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) RegistrationStatus registrationStatus,
            @RequestParam(required = false) AttendanceStatus attendanceStatus,
            @RequestParam(required = false) String search) {
        List<RegistrationResponse> list = adminService.getAllRegistrations(eventId, registrationStatus, attendanceStatus, search);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/events/{eventId}/registrations")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(@PathVariable Long eventId) {
        List<RegistrationResponse> list = adminService.getEventRegistrations(eventId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/participants")
    public ResponseEntity<List<UserResponse>> getAllParticipants(@RequestParam(required = false) String search) {
        List<UserResponse> list = adminService.getAllParticipants(search);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reports/attendance")
    public ResponseEntity<List<EventReportResponse>> getAttendanceReports() {
        List<EventReportResponse> reports = adminService.getAttendanceReports();
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/attendance/check-in")
    public ResponseEntity<AttendanceCheckInResponse> checkInAttendance(@Valid @RequestBody AttendanceCheckInRequest request) {
        AttendanceCheckInResponse response = adminService.checkInAttendance(request.getQrToken());
        return ResponseEntity.ok(response);
    }
}
