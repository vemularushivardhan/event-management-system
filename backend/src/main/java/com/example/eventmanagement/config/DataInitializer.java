package com.example.eventmanagement.config;

import com.example.eventmanagement.entity.*;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.RegistrationRepository;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.service.QrCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final PasswordEncoder passwordEncoder;
    private final QrCodeService qrCodeService;

    @Value("${app.admin.default-email:admin@eventmanagement.com}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password:Admin@123}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-name:System Administrator}")
    private String defaultAdminName;

    @Value("${app.admin.default-phone:9876543210}")
    private String defaultAdminPhone;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           PasswordEncoder passwordEncoder,
                           QrCodeService qrCodeService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.passwordEncoder = passwordEncoder;
        this.qrCodeService = qrCodeService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initializeAdminUser();
        initializeSampleEventsAndRegistrations();
    }

    private void initializeAdminUser() {
        String normalizedAdminEmail = defaultAdminEmail.trim().toLowerCase();
        if (!userRepository.existsByEmail(normalizedAdminEmail)) {
            User admin = new User(
                    defaultAdminName,
                    normalizedAdminEmail,
                    defaultAdminPhone,
                    passwordEncoder.encode(defaultAdminPassword),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Successfully seeded default administrator account: {}", normalizedAdminEmail);
        } else {
            logger.info("Administrator account already exists: {}", normalizedAdminEmail);
        }
    }

    private void initializeSampleEventsAndRegistrations() {
        if (eventRepository.count() == 0) {
            logger.info("Seeding realistic sample events for demonstration and training...");

            Event event1 = new Event(
                    "Full-Stack Cloud Summit 2026",
                    "A premier gathering of cloud architects, full-stack engineers, and DevOps professionals showcasing cutting-edge microservices, Kubernetes orchestration, and serverless architectures.",
                    LocalDate.now().plusDays(10),
                    LocalTime.of(9, 30),
                    "Convention Center Grand Hall, Tech Park, San Francisco",
                    150
            );

            Event event2 = new Event(
                    "AI & Generative Deep Learning Workshop",
                    "Hands-on technical workshop exploring foundational LLM architectures, agentic coding workflows, prompt engineering, and production inference deployment.",
                    LocalDate.now().plusDays(15),
                    LocalTime.of(14, 0),
                    "Auditorium B, Innovation Labs, Seattle",
                    80
            );

            Event event3 = new Event(
                    "Cybersecurity & Zero Trust Architecture Expo",
                    "Deep dive into enterprise defense-in-depth strategies, JWT security best practices, identity access management, and automated threat detection.",
                    LocalDate.now().plusDays(25),
                    LocalTime.of(10, 0),
                    "Metropolitan Convention Suite 3, New York",
                    120
            );

            Event event4 = new Event(
                    "Spring Boot 3 & Microservices Masterclass",
                    "Comprehensive architectural masterclass covering Spring Security 6, reactive APIs, JPA performance tuning, and distributed tracing.",
                    LocalDate.now().plusDays(35),
                    LocalTime.of(11, 0),
                    "Virtual Auditorium Room Alpha (Online Live)",
                    300
            );

            Event event5 = new Event(
                    "UI/UX Design Systems with React & Bootstrap",
                    "Design and implement accessible, scalable component libraries with modern React state management and Bootstrap 5 responsive frameworks.",
                    LocalDate.now().plusDays(40),
                    LocalTime.of(15, 30),
                    "Creative Arts Tech Studio, Austin, TX",
                    60
            );

            List<Event> savedEvents = eventRepository.saveAll(List.of(event1, event2, event3, event4, event5));
            logger.info("Seeded {} sample events.", savedEvents.size());

            // Seed sample participants if not present
            User user1 = userRepository.findByEmail("alice.johnson@example.com").orElseGet(() ->
                    userRepository.save(new User("Alice Johnson", "alice.johnson@example.com", "9811223344", passwordEncoder.encode("Password@123"), Role.USER)));

            User user2 = userRepository.findByEmail("bob.smith@example.com").orElseGet(() ->
                    userRepository.save(new User("Bob Smith", "bob.smith@example.com", "9822334455", passwordEncoder.encode("Password@123"), Role.USER)));

            User user3 = userRepository.findByEmail("carol.williams@example.com").orElseGet(() ->
                    userRepository.save(new User("Carol Williams", "carol.williams@example.com", "9833445566", passwordEncoder.encode("Password@123"), Role.USER)));

            // Seed sample registrations with QR tokens
            if (registrationRepository.count() == 0) {
                Registration reg1 = new Registration(user1, savedEvents.get(0), qrCodeService.generateUniqueQrToken(savedEvents.get(0).getId(), user1.getId()));
                reg1.setAttendanceStatus(AttendanceStatus.ATTENDED);
                reg1.setCheckInTime(LocalDateTime.now().minusHours(2));

                Registration reg2 = new Registration(user2, savedEvents.get(0), qrCodeService.generateUniqueQrToken(savedEvents.get(0).getId(), user2.getId()));

                Registration reg3 = new Registration(user3, savedEvents.get(1), qrCodeService.generateUniqueQrToken(savedEvents.get(1).getId(), user3.getId()));

                Registration reg4 = new Registration(user1, savedEvents.get(2), qrCodeService.generateUniqueQrToken(savedEvents.get(2).getId(), user1.getId()));

                registrationRepository.saveAll(List.of(reg1, reg2, reg3, reg4));
                logger.info("Seeded initial participant registrations.");
            }
        }
    }
}
