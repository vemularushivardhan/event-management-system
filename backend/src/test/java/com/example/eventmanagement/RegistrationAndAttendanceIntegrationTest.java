package com.example.eventmanagement;

import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.entity.AttendanceStatus;
import com.example.eventmanagement.entity.RegistrationStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RegistrationAndAttendanceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String userToken;
    private Long testEventId;

    @BeforeEach
    public void setup() throws Exception {
        // 1. Login admin
        AuthRequest adminReq = new AuthRequest("admin@eventmanagement.com", "Admin@123");
        MvcResult adminRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminReq)))
                .andExpect(status().isOk())
                .andReturn();
        AuthResponse adminAuth = objectMapper.readValue(adminRes.getResponse().getContentAsString(), AuthResponse.class);
        adminToken = adminAuth.getToken();

        // 2. Register distinct test user
        String email = "reguser." + System.currentTimeMillis() + "@example.com";
        RegisterRequest userReq = new RegisterRequest("Test Participant", email, "9899112233", "Password@123");
        MvcResult userRes = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userReq)))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse userAuth = objectMapper.readValue(userRes.getResponse().getContentAsString(), AuthResponse.class);
        userToken = userAuth.getToken();

        // 3. Admin creates a fresh event for this test
        EventRequest eventReq = new EventRequest(
                "Exclusive Testing Summit " + System.currentTimeMillis(),
                "Summit testing registrations and check-ins",
                LocalDate.now().plusDays(14),
                LocalTime.of(10, 0),
                "Lab 101",
                2
        );
        MvcResult eventRes = mockMvc.perform(post("/api/events")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventReq)))
                .andExpect(status().isCreated())
                .andReturn();
        EventResponse createdEvent = objectMapper.readValue(eventRes.getResponse().getContentAsString(), EventResponse.class);
        testEventId = createdEvent.getId();
    }

    @Test
    @DisplayName("Should successfully register for event and generate QR code")
    public void testEventRegistrationAndQrCode() throws Exception {
        MvcResult regRes = mockMvc.perform(post("/api/registrations/events/" + testEventId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.qrToken").isString())
                .andExpect(jsonPath("$.qrCodeBase64").isString())
                .andExpect(jsonPath("$.registrationStatus").value("CONFIRMED"))
                .andExpect(jsonPath("$.attendanceStatus").value("REGISTERED"))
                .andReturn();

        RegistrationResponse regResp = objectMapper.readValue(regRes.getResponse().getContentAsString(), RegistrationResponse.class);

        // Verify duplicate registration is prevented
        mockMvc.perform(post("/api/registrations/events/" + testEventId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("You have already registered for this event."));

        // Admin verifies QR check-in
        AttendanceCheckInRequest checkInReq = new AttendanceCheckInRequest(regResp.getQrToken());
        mockMvc.perform(post("/api/admin/attendance/check-in")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkInReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.registration.attendanceStatus").value("ATTENDED"));

        // Duplicate QR check-in should be prevented
        mockMvc.perform(post("/api/admin/attendance/check-in")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkInReq)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should reject invalid QR code on attendance check-in")
    public void testInvalidQrCodeCheckIn() throws Exception {
        AttendanceCheckInRequest checkInReq = new AttendanceCheckInRequest("INVALID-TOKEN-99999");
        mockMvc.perform(post("/api/admin/attendance/check-in")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(checkInReq)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should enforce event capacity limits")
    public void testEnforceCapacityLimits() throws Exception {
        // Create an event with capacity 1
        EventRequest tinyEvent = new EventRequest(
                "Single Seat Workshop " + System.currentTimeMillis(),
                "Workshop with only 1 available seat",
                LocalDate.now().plusDays(7),
                LocalTime.of(15, 0),
                "Room A",
                1
        );
        MvcResult res = mockMvc.perform(post("/api/events")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tinyEvent)))
                .andExpect(status().isCreated())
                .andReturn();
        EventResponse tinyEventResp = objectMapper.readValue(res.getResponse().getContentAsString(), EventResponse.class);

        // First user registers (success)
        mockMvc.perform(post("/api/registrations/events/" + tinyEventResp.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isCreated());

        // Second user registers (should be rejected as fully booked)
        RegisterRequest secondUser = new RegisterRequest("User Two", "second." + System.currentTimeMillis() + "@test.com", "9812345678", "Password@123");
        MvcResult secondAuthRes = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondUser)))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse secondAuth = objectMapper.readValue(secondAuthRes.getResponse().getContentAsString(), AuthResponse.class);

        mockMvc.perform(post("/api/registrations/events/" + tinyEventResp.getId())
                        .header("Authorization", "Bearer " + secondAuth.getToken()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Event is fully booked. No seats remaining."));
    }
}
