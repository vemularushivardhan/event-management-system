-- ========================================================
-- Event Management & Registration System
-- Sample Seed Data for Technical Training & Demonstration
-- Database: event_management
-- Password for all seed users is: Password@123
-- Password for Admin is: Admin@123
-- ========================================================

USE event_management;

-- 1. Insert Default Administrator (Password: Admin@123)
-- BCrypt: $2a$10$7EqJtq98hPqEX7fNZaFWoOtdW5Z7vL1wK4D.W1gSsm2s3vDkO38nK
INSERT INTO users (id, name, email, phone, password, role, created_at)
VALUES 
(1, 'System Administrator', 'admin@eventmanagement.com', '9876543210', '$2a$10$7EqJtq98hPqEX7fNZaFWoOtdW5Z7vL1wK4D.W1gSsm2s3vDkO38nK', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Sample Users (Password: Password@123)
-- BCrypt: $2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
INSERT INTO users (id, name, email, phone, password, role, created_at)
VALUES 
(2, 'Alice Johnson', 'alice.johnson@example.com', '9811223344', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', NOW()),
(3, 'Bob Smith', 'bob.smith@example.com', '9822334455', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', NOW()),
(4, 'Carol Williams', 'carol.williams@example.com', '9833445566', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', NOW()),
(5, 'David Lee', 'david.lee@example.com', '9844556677', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Sample Events
INSERT INTO events (id, event_name, description, event_date, event_time, venue, capacity, created_at)
VALUES 
(1, 'Full-Stack Cloud Summit 2026', 'A premier gathering of cloud architects, full-stack engineers, and DevOps professionals showcasing cutting-edge microservices and container orchestration.', '2026-11-15', '09:30:00', 'Convention Center Grand Hall, Tech Park, San Francisco', 150, NOW()),
(2, 'AI & Generative Deep Learning Workshop', 'Hands-on technical workshop exploring foundational LLM architectures, agentic systems, prompt engineering, and production inference deployment.', '2026-11-20', '14:00:00', 'Auditorium B, Innovation Labs, Seattle', 80, NOW()),
(3, 'Cybersecurity & Zero Trust Architecture Expo', 'Deep dive into defense-in-depth strategies, identity access management, JWT security best practices, and enterprise threat intelligence.', '2026-12-05', '10:00:00', 'Metropolitan Convention Suite 3, New York', 120, NOW()),
(4, 'Spring Boot 3 & Microservices Masterclass', 'Comprehensive architectural masterclass covering Spring Cloud, reactive APIs, JPA performance tuning, and distributed tracing.', '2026-12-12', '11:00:00', 'Virtual Auditorium Room Alpha (Online)', 300, NOW()),
(5, 'UI/UX Design Systems with React & Bootstrap', 'Design and implement accessible, scalable component libraries with modern React state management and Bootstrap 5 responsive frameworks.', '2026-12-18', '15:30:00', 'Creative Arts Tech Studio, Austin, TX', 60, NOW()),
(6, 'NextGen Web3 & Decentralized Ledger Forum', 'Exploring enterprise blockchain protocols, zero-knowledge proofs, and decentralized identity governance.', '2027-01-10', '10:30:00', 'Silicon Oasis Center, Hall 4, Dubai', 100, NOW())
ON DUPLICATE KEY UPDATE event_name=VALUES(event_name);

-- 4. Insert Sample Registrations
INSERT INTO registrations (id, user_id, event_id, registration_date, qr_token, registration_status, attendance_status, check_in_time)
VALUES 
(1, 2, 1, NOW(), 'QR-EVT1-USR2-A1B2C3D4', 'CONFIRMED', 'ATTENDED', NOW()),
(2, 3, 1, NOW(), 'QR-EVT1-USR3-E5F6G7H8', 'CONFIRMED', 'REGISTERED', NULL),
(3, 4, 2, NOW(), 'QR-EVT2-USR4-I9J0K1L2', 'CONFIRMED', 'REGISTERED', NULL),
(4, 2, 3, NOW(), 'QR-EVT3-USR2-M3N4O5P6', 'CONFIRMED', 'REGISTERED', NULL),
(5, 5, 4, NOW(), 'QR-EVT4-USR5-Q7R8S9T0', 'CONFIRMED', 'REGISTERED', NULL)
ON DUPLICATE KEY UPDATE qr_token=VALUES(qr_token);
