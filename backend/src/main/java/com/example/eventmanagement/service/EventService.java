package com.example.eventmanagement.service;

import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.dto.EventResponse;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.RegistrationStatus;
import com.example.eventmanagement.exception.BadRequestException;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String query, LocalDate fromDate, LocalDate toDate, Boolean onlyAvailable) {
        List<Event> events = eventRepository.searchAndFilterEvents(query, fromDate, toDate);

        // Fetch counts of confirmed registrations per event
        List<Object[]> regCounts = registrationRepository.countConfirmedRegistrationsPerEvent(RegistrationStatus.CONFIRMED);
        Map<Long, Long> countsMap = regCounts.stream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Long) r[1]));

        return events.stream()
                .map(e -> {
                    long count = countsMap.getOrDefault(e.getId(), 0L);
                    return EventResponse.fromEntity(e, count);
                })
                .filter(res -> {
                    if (Boolean.TRUE.equals(onlyAvailable)) {
                        return res.getAvailableSeats() > 0;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        long count = registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.CONFIRMED);
        return EventResponse.fromEntity(event, count);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Event event = new Event(
                request.getEventName().trim(),
                request.getDescription().trim(),
                request.getEventDate(),
                request.getEventTime(),
                request.getVenue().trim(),
                request.getCapacity()
        );

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved, 0L);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        long currentRegistrations = registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.CONFIRMED);
        if (request.getCapacity() < currentRegistrations) {
            throw new BadRequestException("Capacity cannot be reduced below the current confirmed registrations (" + currentRegistrations + ").");
        }

        event.setEventName(request.getEventName().trim());
        event.setDescription(request.getDescription().trim());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setVenue(request.getVenue().trim());
        event.setCapacity(request.getCapacity());

        Event updated = eventRepository.save(event);
        return EventResponse.fromEntity(updated, currentRegistrations);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        // Cascade delete will delete associated registrations via JPA relationship
        eventRepository.delete(event);
    }
}
