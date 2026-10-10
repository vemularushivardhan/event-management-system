package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.AttendanceStatus;
import com.example.eventmanagement.entity.Registration;
import com.example.eventmanagement.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByQrToken(String qrToken);

    Optional<Registration> findByUserIdAndEventIdAndRegistrationStatus(Long userId, Long eventId, RegistrationStatus status);

    boolean existsByUserIdAndEventIdAndRegistrationStatus(Long userId, Long eventId, RegistrationStatus status);

    long countByEventIdAndRegistrationStatus(Long eventId, RegistrationStatus status);

    long countByAttendanceStatus(AttendanceStatus attendanceStatus);

    long countByRegistrationStatus(RegistrationStatus registrationStatus);

    List<Registration> findByUserIdOrderByRegistrationDateDesc(Long userId);

    List<Registration> findByEventIdOrderByRegistrationDateDesc(Long eventId);

    List<Registration> findAllByOrderByRegistrationDateDesc();

    @Query("SELECT r FROM Registration r WHERE " +
           "(:eventId IS NULL OR r.event.id = :eventId) AND " +
           "(:regStatus IS NULL OR r.registrationStatus = :regStatus) AND " +
           "(:attStatus IS NULL OR r.attendanceStatus = :attStatus) AND " +
           "(:query IS NULL OR LOWER(r.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.user.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.qrToken) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY r.registrationDate DESC")
    List<Registration> filterRegistrations(@Param("eventId") Long eventId,
                                           @Param("regStatus") RegistrationStatus regStatus,
                                           @Param("attStatus") AttendanceStatus attStatus,
                                           @Param("query") String query);

    @Query("SELECT r.event.id, COUNT(r) FROM Registration r WHERE r.registrationStatus = :status GROUP BY r.event.id")
    List<Object[]> countConfirmedRegistrationsPerEvent(@Param("status") RegistrationStatus status);

    @Query("SELECT r.event.id, COUNT(r) FROM Registration r WHERE r.attendanceStatus = :status GROUP BY r.event.id")
    List<Object[]> countAttendedPerEvent(@Param("status") AttendanceStatus status);
}
