package com.example.eventmanagement.dto;

import com.example.eventmanagement.entity.Event;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EventResponse {

    private Long id;
    private String eventName;
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
    private Integer capacity;
    private long registeredCount;
    private long availableSeats;
    private boolean isFull;
    private boolean isPast;
    private LocalDateTime createdAt;

    public EventResponse() {
    }

    public static EventResponse fromEntity(Event event, long registeredCount) {
        if (event == null) return null;
        EventResponse resp = new EventResponse();
        resp.setId(event.getId());
        resp.setEventName(event.getEventName());
        resp.setDescription(event.getDescription());
        resp.setEventDate(event.getEventDate());
        resp.setEventTime(event.getEventTime());
        resp.setVenue(event.getVenue());
        resp.setCapacity(event.getCapacity());
        resp.setRegisteredCount(registeredCount);
        long available = Math.max(0, event.getCapacity() - registeredCount);
        resp.setAvailableSeats(available);
        resp.setFull(available <= 0);
        resp.setPast(event.getEventDate().isBefore(LocalDate.now()));
        resp.setCreatedAt(event.getCreatedAt());
        return resp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public long getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(long registeredCount) {
        this.registeredCount = registeredCount;
    }

    public long getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(long availableSeats) {
        this.availableSeats = availableSeats;
    }

    public boolean isFull() {
        return isFull;
    }

    public void setFull(boolean full) {
        isFull = full;
    }

    public boolean isPast() {
        return isPast;
    }

    public void setPast(boolean past) {
        isPast = past;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
