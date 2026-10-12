# 🏢 NexusEMS - Enterprise Employee & Workforce Management System

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

A full-stack, enterprise-grade Employee Management System featuring an **Executive Analytics Dashboard**, **JWT Authentication & Role-Based Authorization**, **Interactive OpenAPI 3.0 Documentation**, **Dynamic Pagination & Multi-field Filtering**, **CSV Reporting**, and **Docker Containerization**.

---

## 🌟 Key Features & Highlights

### 📊 Executive Analytics Dashboard
* **Workforce KPIs**: Real-time stats on Total Staff Count, Active Status percentages, Department counts, and Total Monthly Payroll expense calculations.
* **Department Distribution Charts**: Visual salary and headcount distribution progress indicators per department.
* **Recent Onboarding Activity Feed**: Chronological list of latest employee additions with avatar indicators and status tags.

### 👥 Comprehensive Employee Directory
* **Search & Multi-field Filtering**: Instant search across name, email, role, and department. Filter by Department pills and Employment Status (Active vs On Leave).
* **Sorting & Views Switcher**: Toggle between a **Glassmorphic Grid Card View** and a **Compact Data Table View**. Sort records dynamically by Name, Salary, or Joining Date.
* **Modal Profile Details**: Expandable glassmorphic modal displaying full employee contact card, salary badge, verified status, and department metadata.
* **One-Click CSV Export**: Stream and download full workforce records into a CSV file report.

### 🔐 Security & Database Engineering
* **JWT Authentication**: Secure stateless token issuance (`/login` & `/register`) with BCrypt password hashing and Spring Security filter chains.
* **Dual Database Mode (Zero-Config Testing)**:
  * **H2 In-Memory DB Profile**: Zero-setup plug-and-play mode with pre-seeded mock dataset (`DataInitializer`) for instant reviewer evaluation.
  * **MySQL Enterprise Profile**: Production-ready MySQL configuration.
* **OpenAPI 3.0 / Swagger UI Integration**: Live, interactive API documentation accessible at `/swagger-ui.html`.
* **Standalone Demo Fallback**: Frontend gracefully activates interactive standalone mock mode if the Java backend is offline.

---

## 📐 System Architecture

```mermaid
graph TD
    Client[React 19 + Vite Frontend] -->|REST APIs / Bearer JWT| Controller[Spring Boot Controller Layer]
    Controller -->|DTO Validation| Security[Spring Security & JWT Filter]
    Security -->|Service Logic| Service[Employee & User Services]
    Service -->|Spring Data JPA| Repo[Spring JPA Repositories]
    Repo -->|Dev Profile| H2[(H2 In-Memory DB)]
    Repo -->|Prod Profile| MySQL[(MySQL Database)]
    Controller -->|OpenAPI Specs| Swagger[Swagger UI Docs]
```

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework**: React.js 19, Vite
* **Routing & State**: React Router DOM v7, Context API (`AuthContext`)
* **Styling**: Modern Glassmorphism CSS design system, Bootstrap 5
* **Icons & Notifications**: Lucide React, React Toastify
* **HTTP Client**: Axios with Bearer token request interceptor

### **Backend**
* **Framework**: Java 17, Spring Boot
* **Security**: Spring Security, JJWT (JSON Web Token 0.12.5), BCrypt Password Encoder
* **Persistence**: Spring Data JPA, Hibernate, H2 Database / MySQL
* **Documentation**: Springdoc OpenAPI 3.0 / Swagger UI
* **Validation**: JSR-303 Validation (`@NotBlank`, `@Email`, `@Positive`)

### **DevOps & Containerization**
* **Docker & Docker Compose**: Multi-stage build containers for Spring Boot, Nginx React frontend, and MySQL 8.0.
* **CI Pipeline**: GitHub Actions workflow (`.github/workflows/ci.yml`).

---

## 🚀 Quick Start Guide

### Option 1: Standalone Frontend Demo (No Installation Required)
```bash
cd ReactForEmployee/Employee-Management-System
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The app runs with interactive mock data out of the box!

---

### Option 2: Full-Stack Local Execution (Spring Boot + H2/MySQL + React)

#### 1. Start Spring Boot Backend
```bash
cd EmployeeManagementCRUD
# Run using Maven Wrapper (auto-creates H2 database and pre-seeds demo employees)
.\mvnw.cmd spring-boot:run
```
* **Backend API Base**: `http://localhost:8080`
* **Swagger UI API Docs**: `http://localhost:8080/swagger-ui.html`
* **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:employeedb`, User: `sa`, Password: blank)
* **Default Admin Account**: Username: `admin` | Password: `admin123`

#### 2. Start React Frontend
```bash
cd ReactForEmployee/Employee-Management-System
npm install
npm run dev
```

---

### Option 3: One-Command Docker Setup 🐳
To spin up MySQL 8.0, Spring Boot Backend, and Nginx React Frontend simultaneously:
```bash
docker-compose up --build
```
* Frontend: `http://localhost:5173`
* Backend: `http://localhost:8080`
* Swagger API Docs: `http://localhost:8080/swagger-ui.html`

---

## 📡 Key REST API Endpoints

### 🔐 Authentication (`/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register new user account and receive JWT |
| `POST` | `/login` | Authenticate credentials and receive Bearer Token |
| `GET` | `/users` | Get registered users list |

### 👥 Employee Operations (`/employee`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/employee/all` | Fetch all employee records |
| `GET` | `/employee/paged` | Get paginated, searchable, and filtered employees |
| `GET` | `/employee/{id}` | Fetch single employee details by ID |
| `POST` | `/employee/add` | Create new employee with validation |
| `PUT` | `/employee/update` | Update existing employee record |
| `DELETE` | `/employee/delete/{id}` | Remove employee by ID |
| `GET` | `/employee/stats` | Fetch Dashboard KPI analytics |
| `GET` | `/employee/export/csv` | Download workforce records as CSV |

---

## 👨‍💻 Author

**Sudarshan Bhat**  
* GitHub: [@sudubhat23](https://github.com/sudubhat23)  
* Tech Stack: Java, Spring Boot, React.js, Full Stack Development
