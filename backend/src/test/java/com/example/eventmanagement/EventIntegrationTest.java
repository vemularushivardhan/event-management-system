package com.example.eventmanagement;

import com.example.eventmanagement.dto.AuthRequest;
import com.example.eventmanagement.dto.AuthResponse;
import com.example.eventmanagement.dto.EventRequest;
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
public class EventIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    public void setup() throws Exception {
        AuthRequest loginReq = new AuthRequest("admin@eventmanagement.com", "Admin@123");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse authResp = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponse.class);
        adminToken = authResp.getToken();
    }

    @Test
    @DisplayName("Should permit public browsing of events")
    public void testPublicBrowseEvents() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Admin can create a new event")
    public void testAdminCreateEvent() throws Exception {
        EventRequest newEvent = new EventRequest(
                "Docker & Kubernetes Deep Dive",
                "Advanced containerization concepts and cluster orchestration",
                LocalDate.now().plusDays(30),
                LocalTime.of(10, 0),
                "Hall C, Silicon Valley",
                75
        );

        mockMvc.perform(post("/api/events")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventName").value("Docker & Kubernetes Deep Dive"))
                .andExpect(jsonPath("$.capacity").value(75))
                .andExpect(jsonPath("$.availableSeats").value(75));
    }

    @Test
    @DisplayName("Non-admin request to create event should return 403 Forbidden")
    public void testNonAdminCannotCreateEvent() throws Exception {
        EventRequest newEvent = new EventRequest(
                "Unauthorized Hack Event",
                "This should not be created",
                LocalDate.now().plusDays(20),
                LocalTime.of(14, 0),
                "Unknown",
                50
        );

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isUnauthorized());
    }
}
