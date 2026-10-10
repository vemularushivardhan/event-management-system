package com.example.eventmanagement.dto;

public class DashboardStatsResponse {

    private long totalEvents;
    private long totalRegisteredParticipants;
    private long totalAttendance;
    private long upcomingEvents;
    private double attendanceRatePercentage;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalEvents, long totalRegisteredParticipants, long totalAttendance, long upcomingEvents, double attendanceRatePercentage) {
        this.totalEvents = totalEvents;
        this.totalRegisteredParticipants = totalRegisteredParticipants;
        this.totalAttendance = totalAttendance;
        this.upcomingEvents = upcomingEvents;
        this.attendanceRatePercentage = attendanceRatePercentage;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalRegisteredParticipants() {
        return totalRegisteredParticipants;
    }

    public void setTotalRegisteredParticipants(long totalRegisteredParticipants) {
        this.totalRegisteredParticipants = totalRegisteredParticipants;
    }

    public long getTotalAttendance() {
        return totalAttendance;
    }

    public void setTotalAttendance(long totalAttendance) {
        this.totalAttendance = totalAttendance;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public double getAttendanceRatePercentage() {
        return attendanceRatePercentage;
    }

    public void setAttendanceRatePercentage(double attendanceRatePercentage) {
        this.attendanceRatePercentage = attendanceRatePercentage;
    }
}
