package com.SpringBoot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    private String phone;

    private Integer age;

    @NotBlank(message = "Department is required")
    private String dept;

    private String role;

    @Positive(message = "Salary must be positive")
    private Double salary;

    private String status = "ACTIVE"; // ACTIVE, ON_LEAVE, TERMINATED

    private LocalDate joiningDate = LocalDate.now();

    private String avatarUrl;

    public EmployeeEntity() {
        super();
    }

    public EmployeeEntity(Integer id, String firstName, String lastName, String email, String phone, 
                          Integer age, String dept, String role, Double salary, String status, 
                          LocalDate joiningDate, String avatarUrl) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.dept = dept;
        this.role = role;
        this.salary = salary;
        this.status = status != null ? status : "ACTIVE";
        this.joiningDate = joiningDate != null ? joiningDate : LocalDate.now();
        this.avatarUrl = avatarUrl;
    }

    // Constructor for legacy compatibility (id, name, age, dept)
    public EmployeeEntity(Integer id, String name, Integer age, String dept) {
        this.id = id;
        if (name != null) {
            String[] parts = name.split(" ", 2);
            this.firstName = parts[0];
            this.lastName = parts.length > 1 ? parts[1] : "";
        }
        this.age = age;
        this.dept = dept;
        this.status = "ACTIVE";
        this.joiningDate = LocalDate.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // Helper for backward compatibility
    public String getName() {
        if (firstName == null && lastName == null) return "";
        return ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
    }

    public void setName(String name) {
        if (name != null && !name.isBlank()) {
            String[] parts = name.trim().split(" ", 2);
            this.firstName = parts[0];
            this.lastName = parts.length > 1 ? parts[1] : "";
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private String bio;

    private String skills;

    private String emergencyContact;

    private String address;

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "EmployeeEntity [id=" + id + ", firstName=" + firstName + ", lastName=" + lastName + 
               ", email=" + email + ", dept=" + dept + ", role=" + role + ", salary=" + salary + 
               ", status=" + status + "]";
    }
}
