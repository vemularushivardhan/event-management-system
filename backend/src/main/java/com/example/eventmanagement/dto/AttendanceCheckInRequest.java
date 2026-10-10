package com.example.eventmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class AttendanceCheckInRequest {

    @NotBlank(message = "QR Token is required")
    private String qrToken;

    public AttendanceCheckInRequest() {
    }

    public AttendanceCheckInRequest(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken != null ? qrToken.trim() : null;
    }
}
