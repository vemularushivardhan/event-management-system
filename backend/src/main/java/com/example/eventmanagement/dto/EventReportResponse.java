package com.example.eventmanagement.dto;

import java.time.LocalDate;

public class EventReportResponse {

    private Long eventId;
    private String eventName;
    private LocalDate eventDate;
    private Integer capacity;
    private long totalRegistrations;
    private long totalAttendance;
    private double attendanceRatePercentage;
    private double occupancyPercentage;

    public EventReportResponse() {
    }

    public EventReportResponse(Long eventId, String eventName, LocalDate eventDate, Integer capacity, long totalRegistrations, long totalAttendance) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.capacity = capacity;
        this.totalRegistrations = totalRegistrations;
        this.totalAttendance = totalAttendance;
        this.occupancyPercentage = (capacity != null && capacity > 0)
                ? Math.round(((double) totalRegistrations / capacity) * 10000.0) / 100.0
                : 0.0;
        this.attendanceRatePercentage = (totalRegistrations > 0)
                ? Math.round(((double) totalAttendance / totalRegistrations) * 10000.0) / 100.0
                : 0.0;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getTotalAttendance() {
        return totalAttendance;
    }

    public void setTotalAttendance(long totalAttendance) {
        this.totalAttendance = totalAttendance;
    }

    public double getAttendanceRatePercentage() {
        return attendanceRatePercentage;
    }

    public void setAttendanceRatePercentage(double attendanceRatePercentage) {
        this.attendanceRatePercentage = attendanceRatePercentage;
    }

    public double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }
}
