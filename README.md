# Employee Management System

A Full Stack Employee Management System built using Spring Boot, React.js, MySQL, and Spring Security.

## Features

* User Registration
* User Login Authentication
* Protected Routes
* Add Employee
* View Employees
* Update Employee Details
* Delete Employee
* Responsive UI using React Bootstrap
* REST API Integration using Axios
* MySQL Database Connectivity

## Tech Stack

### Frontend

* React.js
* React Router DOM
* React Bootstrap
* Axios
* React Toastify
* Vite

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* MySQL

## Project Structure

EmployeeManagementCRUD/

* Spring Boot Backend

ReactForEmployee/

* React Frontend

## API Endpoints

### Authentication

POST /register

POST /login

### Employee Operations

GET /employee/all

GET /employee/{id}

POST /employee/add

PUT /employee/update

DELETE /employee/delete/{id}

## Database

MySQL is used as the database.

Configure the database connection in:

src/main/resources/application.properties

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/employeedb

spring.datasource.username=root

spring.datasource.password=yourpassword

## Installation

### Backend

```bash
cd EmployeeManagementCRUD
mvn spring-boot:run
```

### Frontend

```bash
cd ReactForEmployee/Employee-Management-System
npm install
npm run dev
```

## Future Enhancements

* JWT Authentication
* Role Based Authorization
* Employee Search
* Pagination
* Docker Deployment
* Cloud Deployment (AWS/Render/Vercel)

## Author

Sudarshan Bhat

GitHub: https://github.com/sudubhat23
