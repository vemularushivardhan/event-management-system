package com.example.eventmanagement.dto;

import com.example.eventmanagement.entity.AttendanceStatus;
import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.entity.RegistrationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class RegistrationResponse {

    private Long id;
    private Long eventId;
    private String eventName;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;

    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;

    private LocalDateTime registrationDate;
    private String qrToken;
    private RegistrationStatus registrationStatus;
    private AttendanceStatus attendanceStatus;
    private LocalDateTime checkInTime;
    private String qrCodeBase64;

    public RegistrationResponse() {
    }

    public static RegistrationResponse fromEntity(Registration reg, String qrCodeBase64) {
        if (reg == null) return null;
        RegistrationResponse resp = new RegistrationResponse();
        resp.setId(reg.getId());

        if (reg.getEvent() != null) {
            resp.setEventId(reg.getEvent().getId());
            resp.setEventName(reg.getEvent().getEventName());
            resp.setEventDate(reg.getEvent().getEventDate());
            resp.setEventTime(reg.getEvent().getEventTime());
            resp.setVenue(reg.getEvent().getVenue());
        }

        if (reg.getUser() != null) {
            resp.setUserId(reg.getUser().getId());
            resp.setUserName(reg.getUser().getName());
            resp.setUserEmail(reg.getUser().getEmail());
            resp.setUserPhone(reg.getUser().getPhone());
        }

        resp.setRegistrationDate(reg.getRegistrationDate());
        resp.setQrToken(reg.getQrToken());
        resp.setRegistrationStatus(reg.getRegistrationStatus());
        resp.setAttendanceStatus(reg.getAttendanceStatus());
        resp.setCheckInTime(reg.getCheckInTime());
        resp.setQrCodeBase64(qrCodeBase64);

        return resp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }
}
