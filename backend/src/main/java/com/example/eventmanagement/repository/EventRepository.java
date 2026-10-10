package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAscEventTimeAsc(LocalDate date);

    @Query("SELECT e FROM Event e WHERE " +
           "(:query IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:fromDate IS NULL OR e.eventDate >= :fromDate) AND " +
           "(:toDate IS NULL OR e.eventDate <= :toDate) " +
           "ORDER BY e.eventDate ASC, e.eventTime ASC")
    List<Event> searchAndFilterEvents(@Param("query") String query,
                                      @Param("fromDate") LocalDate fromDate,
                                      @Param("toDate") LocalDate toDate);

    long countByEventDateGreaterThanEqual(LocalDate date);
}
