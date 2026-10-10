# Event Management & Registration System

A full-stack, enterprise-grade **Event Management & Registration System** built for technical training, pairing **Spring Boot 3.x** and **MySQL** on the backend with **React.js** and **Bootstrap 5** on the frontend. The system provides role-based authentication, capacity-enforced seat booking, unique QR pass issuance, and real-time camera-based QR attendance scanning.

---

## 1. Project Overview & Architecture

### High-Level Architecture
- **Stateless REST Backend**: Spring Boot 3 with Spring Web, Spring Security 6, Spring Data JPA, and Hibernate.
- **Relational Storage**: MySQL 8.x database (`event_management`) with automated schema updates and seed initialization.
- **Single Page Application (SPA)**: React 18, React Router DOM 6, Axios HTTP client, and modern Bootstrap 5 styling with customized Navy & Royal Blue theme.
- **Cryptographic Security**: BCrypt password hashing, stateless JJWT (JSON Web Token) bearer tokens, and server-side role validation.
- **Contactless Attendance**: ZXing and QRCode.react QR generation, paired with `html5-qrcode` device camera scanner and manual fallback verification.

---

## 2. Directory Structure

```text
EventManagementSystem/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/eventmanagement/
│   │   │   │   ├── config/             # SecurityConfig, DataInitializer
│   │   │   │   ├── controller/         # AuthController, EventController, RegistrationController, AdminController
│   │   │   │   ├── dto/                # Request and Response transfer objects
│   │   │   │   ├── entity/             # User, Event, Registration, Role enums
│   │   │   │   ├── exception/          # GlobalExceptionHandler, Custom exceptions
│   │   │   │   ├── repository/         # Spring Data JPA repositories with custom queries
│   │   │   │   ├── security/           # JwtUtils, JwtFilter, CustomUserDetails, UserDetailsService
│   │   │   │   ├── service/            # AuthService, EventService, RegistrationService, AdminService, QrCodeService
│   │   │   │   └── EventManagementApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties # Main Spring Boot MySQL configuration
│   │   └── test/
│   │       ├── java/com/example/eventmanagement/
│   │       │   ├── AuthIntegrationTest.java
│   │       │   ├── EventIntegrationTest.java
│   │       │   └── RegistrationAndAttendanceIntegrationTest.java
│   │       └── resources/
│   │           └── application.properties # Test profile with H2 in-memory DB
│   ├── pom.xml
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/                 # Navbar, Footer, EventCard, DashboardCard, LoadingSpinner, AlertMessage, ConfirmationModal, AdminLayout
│   │   ├── context/                    # AuthContext
│   │   ├── pages/                      # Home, Login, Register, Events, EventDetails, MyRegistrations, RegistrationConfirmation
│   │   │   └── admin/                  # AdminLogin, AdminDashboard, AdminEvents, AdminEventForm, AdminRegistrations, AdminParticipants, AdminAttendance, AdminReports
│   │   ├── routes/                     # ProtectedRoute guard
│   │   ├── services/                   # api.js, authService, eventService, registrationService, adminService
│   │   ├── styles/                     # custom.css
│   │   ├── App.js                      # Routing configuration
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── database/
│   ├── schema.sql                      # DDL schema for MySQL 8
│   └── sample-data.sql                 # Seed users, events, and sample registrations
├── README.md
└── .gitignore
```

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | 18.x | Component-based Single Page Application |
| | React Router DOM | 6.x | Declarative client-side routing & protected routes |
| | Bootstrap | 5.3.x | Responsive UI grid, components & styling |
| | Axios | 1.x | Promise-based REST API client with interceptors |
| | HTML5 QR Code | 2.3.x | Device camera QR code reader |
| | QRCode.react | 3.1.x | Client-side QR code vector rendering & PNG download |
| **Backend** | Java | 17+ (Tested on Java 21) | Core programming language |
| | Spring Boot | 3.3.4 | REST microservice framework |
| | Spring Security | 6.x | Role-based authorization & stateless authentication |
| | Spring Data JPA | 3.x | ORM & data persistence abstraction |
| | JJWT | 0.12.6 | JWT token issuance and signature verification |
| | ZXing | 3.5.3 | QR barcode generator |
| | Maven | 3.9.x | Build and dependency lifecycle manager |
| **Database** | MySQL | 8.x | Production relational storage (`event_management`) |
| | H2 Database | 2.x | Automated isolated integration testing profile |

---

## 4. Setup & Installation Guide

### Prerequisites
Make sure the following tools are installed on your machine:
- **Java Development Kit (JDK 17 or higher)** (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)
- **Node.js 18+ and npm** (`node -v`, `npm -v`)
- **MySQL Server 8.0+** running locally on port 3306

---

### Step 1: Database Setup (MySQL)

1. Open MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Create the database (or run `database/schema.sql`):
   ```sql
   CREATE DATABASE IF NOT EXISTS event_management
   CHARACTER SET utf8mb4
   COLLATE utf8mb4_unicode_ci;
   ```
3. *(Optional)* Run `database/sample-data.sql` to populate sample users, conferences, and registrations. Note that the backend's `DataInitializer` also automatically seeds initial events and administrators if the database is fresh!

---

### Step 2: Backend Configuration & Startup

1. Open `backend/src/main/resources/application.properties` (or set environment variables in `backend/.env`):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/event_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
2. Run backend tests to verify compilation and logic:
   ```bash
   cd backend
   mvn clean test
   ```
3. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will start on **`http://localhost:8080`**.

---

### Step 3: Frontend Startup

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Verify `frontend/.env` points to the backend:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The application will launch in your browser at **`http://localhost:3000`**.

---

## 5. Pre-Configured Test Accounts

The system includes pre-configured credentials for quick evaluation:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@eventmanagement.com` | `Admin@123` | Full administrative control: Event CRUD, Registrations, QR Scanner, Reports |
| **USER** | `alice.johnson@example.com` | `Password@123` | Browse events, Register, View QR Pass, Cancel registration |
| **USER** | `bob.smith@example.com` | `Password@123` | Additional attendee account |

> **Note**: Both the user login page (`/login`) and the admin login page (`/admin/login`) include **"Auto-Fill"** buttons for immediate 1-click credential filling.

---

## 6. Key Features & Workflows

### 1. User Journey
1. **Browse Events**: Filter by name, venue, date ranges, and only seats with remaining capacity.
2. **Event Details**: Real-time progress bar of seat occupancy, remaining seat counter, and full event detection.
3. **Registration**: 1-click registration with confirmation dialog; duplicate bookings by the same user are rejected with HTTP 409 Conflict.
4. **Unique QR Ticket**: Cryptographic, unique QR token generated upon booking.
5. **Download Ticket**: Participants can download their digital QR ticket in high-resolution PNG format.
6. **Self-Service Cancellation**: Registered users can cancel their booking prior to event attendance, immediately restoring seat availability.

### 2. Admin Operations
1. **Live Analytics Dashboard**: Real-time metrics for total events, registered attendees, confirmed check-ins, and turnout percentage.
2. **Event Management**: Create summits with date/time pickers, capacity limit controls, edit details, and safe cascading deletion.
3. **Participant Management**: Search attendees by name or email, view registered event count, and inspect booking history.
4. **Camera & Manual QR Scanner**:
   - Device camera barcode scanning via `Html5QrcodeScanner`.
   - Fallback manual token entry for devices without camera access.
   - Prevents duplicate attendance (returns error if already scanned).
   - Prevents check-in for cancelled bookings.
5. **Turnout Reports**: Interactive occupancy and turnout percentage bars per event.

---

## 7. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new participant account (Enforces `ROLE_USER`).
- `POST /api/auth/login` — Authenticate and receive a JWT Bearer token.
- `GET /api/auth/me` — Return the currently authenticated user profile.

### Events (`/api/events`)
- `GET /api/events` — Publicly list all upcoming events (supports `?search=`, `?fromDate=`, `?toDate=`, `?onlyAvailable=`).
- `GET /api/events/{id}` — Publicly get complete event details with available seat count.
- `POST /api/events` — `ADMIN` only: Create a new event.
- `PUT /api/events/{id}` — `ADMIN` only: Update an existing event.
- `DELETE /api/events/{id}` — `ADMIN` only: Delete an event and cascade-clean registrations.

### Registrations (`/api/registrations`)
- `POST /api/registrations/events/{eventId}` — Authenticated: Register for an event (enforces duplicate prevention & capacity limits).
- `GET /api/registrations/my` — Authenticated: View all registrations belonging to the current user.
- `GET /api/registrations/{id}` — Authenticated: View registration details & QR code (owner or admin).
- `DELETE /api/registrations/{id}` — Authenticated: Cancel a registration and free up capacity.

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard/stats` — `ADMIN` only: Aggregate dashboard statistics.
- `GET /api/admin/registrations` — `ADMIN` only: Filterable registrations list.
- `GET /api/admin/events/{eventId}/registrations` — `ADMIN` only: Registrations for a specific event.
- `GET /api/admin/participants` — `ADMIN` only: Searchable directory of participants.
- `GET /api/admin/reports/attendance` — `ADMIN` only: Capacity occupancy and turnout rates.
- `POST /api/admin/attendance/check-in` — `ADMIN` only: Verify QR token and mark attendance.

---

## 8. Troubleshooting

- **CORS Errors**: The Spring Security configuration allows `http://localhost:3000` and all localhost ports with credentials. Ensure the frontend is accessing `http://localhost:8080/api`.
- **Database Access Denied**: Update `spring.datasource.password` in `backend/src/main/resources/application.properties` with your local MySQL root password.
- **Camera Permissions in QR Scanner**: Browser security requires localhost or HTTPS to grant webcam permissions. If running on an insecure network, use the built-in **Manual Token Entry** field.
