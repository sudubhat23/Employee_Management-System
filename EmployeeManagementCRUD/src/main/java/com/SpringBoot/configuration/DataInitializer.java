package com.SpringBoot.configuration;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.Rpository.MessageRepo;
import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.ChatMessage;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed initial employees if repository is empty
        if (employeeRepo.count() == 0) {
            EmployeeEntity emp1 = new EmployeeEntity(null, "Sarah", "Connor", "sarah.connor@techcorp.com", "+1-555-0101", 32, "Engineering", "Principal Engineer", 125000.0, "ACTIVE", LocalDate.of(2021, 3, 15), "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
            emp1.setBio("Lead cloud architect and senior systems design specialist. Passionate about distributed systems, microservices, and AI integrations.");
            emp1.setSkills("Java, Spring Boot, React, AWS, Docker, Kubernetes");
            emp1.setEmergencyContact("John Connor (+1-555-9988)");
            emp1.setAddress("452 Innovation Blvd, Suite 300, San Francisco, CA");

            EmployeeEntity emp2 = new EmployeeEntity(null, "Alexander", "Wright", "alex.wright@techcorp.com", "+1-555-0102", 28, "Engineering", "Senior FullStack Developer", 110000.0, "ACTIVE", LocalDate.of(2022, 6, 1), "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
            emp2.setBio("Full-stack engineer crafting sleek enterprise UI/UX and scalable backend microservices.");
            emp2.setSkills("React, TypeScript, Node.js, Spring Cloud, PostgreSQL");
            emp2.setEmergencyContact("Emily Wright (+1-555-7766)");
            emp2.setAddress("78 Silicon Valley Way, San Jose, CA");

            EmployeeEntity emp3 = new EmployeeEntity(null, "Elena", "Rostova", "elena.r@techcorp.com", "+1-555-0103", 35, "Human Resources", "HR Lead Manager", 92000.0, "ACTIVE", LocalDate.of(2020, 1, 10), "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150");
            emp3.setBio("Oversees global talent acquisition, enterprise culture, and employee workplace satisfaction.");
            emp3.setSkills("Talent Strategy, Performance Management, Conflict Resolution");
            emp3.setEmergencyContact("Viktor Rostova (+1-555-3344)");
            emp3.setAddress("12 Corporate Center Dr, Austin, TX");

            EmployeeEntity emp4 = new EmployeeEntity(null, "David", "Kim", "david.kim@techcorp.com", "+1-555-0104", 26, "Design", "UI/UX Designer", 85000.0, "ACTIVE", LocalDate.of(2023, 2, 20), "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
            emp4.setBio("Product visual designer focused on human-centric interfaces, design systems, and mobile UX.");
            emp4.setSkills("Figma, Design Systems, Tailwind, Prototyping");
            emp4.setEmergencyContact("Hannah Kim (+1-555-4455)");
            emp4.setAddress("900 Market St, Seattle, WA");

            EmployeeEntity emp5 = new EmployeeEntity(null, "Jessica", "Taylor", "jessica.t@techcorp.com", "+1-555-0105", 41, "Finance", "Chief Financial Analyst", 135000.0, "ACTIVE", LocalDate.of(2019, 11, 5), "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150");
            emp5.setBio("Directs corporate financial modeling, budget planning, and capital allocations.");
            emp5.setSkills("Financial Modeling, Forecasting, SAP, Audit");

            EmployeeEntity emp6 = new EmployeeEntity(null, "Marcus", "Vance", "marcus.vance@techcorp.com", "+1-555-0106", 30, "Marketing", "Growth Marketing Lead", 88000.0, "ON_LEAVE", LocalDate.of(2022, 9, 12), "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150");
            emp6.setBio("Drives outbound user growth, product positioning, and enterprise branding campaigns.");

            EmployeeEntity emp7 = new EmployeeEntity(null, "Priya", "Sharma", "priya.sharma@techcorp.com", "+1-555-0107", 29, "Engineering", "DevOps Engineer", 105000.0, "ACTIVE", LocalDate.of(2023, 1, 15), "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
            emp7.setBio("Automating CI/CD pipelines and infrastructure reliability with Terraform and Kubernetes.");

            EmployeeEntity emp8 = new EmployeeEntity(null, "Michael", "Brown", "michael.b@techcorp.com", "+1-555-0108", 45, "Sales", "VP of Global Sales", 145000.0, "ACTIVE", LocalDate.of(2018, 4, 1), "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150");

            List<EmployeeEntity> savedEmployees = employeeRepo.saveAll(Arrays.asList(emp1, emp2, emp3, emp4, emp5, emp6, emp7, emp8));
            System.out.println(">>> DataInitializer: Preloaded " + savedEmployees.size() + " employees.");
        }

        // 2. Seed Default Accounts (Admin, Manager, and Employee accounts)
        if (userRepo.count() == 0) {
            // Admin Account
            User admin = new User(
                    null,
                    "Admin",
                    "User",
                    "admin",
                    "admin@company.com",
                    passwordEncoder.encode("admin123"),
                    "ROLE_ADMIN"
            );
            userRepo.save(admin);

            // Manager Account (Elena)
            var elenaOpt = employeeRepo.findByEmailIgnoreCase("elena.r@techcorp.com");
            User manager = new User(
                    null,
                    "Elena",
                    "Rostova",
                    "elena",
                    "elena.r@techcorp.com",
                    passwordEncoder.encode("manager123"),
                    "ROLE_MANAGER"
            );
            elenaOpt.ifPresent(e -> manager.setEmployeeId(e.getId()));
            userRepo.save(manager);

            // Employee Account (Sarah Connor)
            var sarahOpt = employeeRepo.findByEmailIgnoreCase("sarah.connor@techcorp.com");
            User employeeSarah = new User(
                    null,
                    "Sarah",
                    "Connor",
                    "sarah",
                    "sarah.connor@techcorp.com",
                    passwordEncoder.encode("employee123"),
                    "ROLE_EMPLOYEE"
            );
            sarahOpt.ifPresent(e -> employeeSarah.setEmployeeId(e.getId()));
            userRepo.save(employeeSarah);

            // Employee Account (Alexander Wright)
            var alexOpt = employeeRepo.findByEmailIgnoreCase("alex.wright@techcorp.com");
            User employeeAlex = new User(
                    null,
                    "Alexander",
                    "Wright",
                    "alex",
                    "alex.wright@techcorp.com",
                    passwordEncoder.encode("employee123"),
                    "ROLE_EMPLOYEE"
            );
            alexOpt.ifPresent(e -> employeeAlex.setEmployeeId(e.getId()));
            userRepo.save(employeeAlex);

            System.out.println(">>> DataInitializer: Created Admin (admin/admin123), Manager (elena/manager123), and Employees (sarah/employee123, alex/employee123).");
        }

        // 3. Seed Initial Official Messages & Broadcasts
        if (messageRepo.count() == 0) {
            List<ChatMessage> sampleMessages = Arrays.asList(
                    new ChatMessage(
                            null,
                            "admin",
                            "Admin User",
                            "Administrator",
                            "ALL",
                            "All Workforce",
                            "general",
                            "ANNOUNCEMENT",
                            "Welcome to the NexusEMS Enterprise Portal v2.0! All employees can now manage their profiles, review company HR policies via the AI Copilot, and communicate officially.",
                            LocalDateTime.now().minusHours(4),
                            true
                    ),
                    new ChatMessage(
                            null,
                            "elena",
                            "Elena Rostova",
                            "HR Lead Manager",
                            "ALL",
                            "All Workforce",
                            "general",
                            "HR_INQUIRY",
                            "Reminder: Annual benefits enrollment and flexible remote work schedules for Q4 must be confirmed by this Friday. Please contact HR for any assistance.",
                            LocalDateTime.now().minusHours(3),
                            true
                    ),
                    new ChatMessage(
                            null,
                            "sarah",
                            "Sarah Connor",
                            "Principal Engineer",
                            "ALL",
                            "Engineering Team",
                            "engineering",
                            "PROJECT",
                            "Hey team! The production migration to Spring Boot and the AI service endpoints has been deployed successfully. All tests are passing green.",
                            LocalDateTime.now().minusHours(2),
                            true
                    ),
                    new ChatMessage(
                            null,
                            "alex",
                            "Alexander Wright",
                            "Senior FullStack Developer",
                            "ALL",
                            "Engineering Team",
                            "engineering",
                            "GENERAL",
                            "Awesome work Sarah! The frontend React UI components with responsive glassmorphism are connected and tested.",
                            LocalDateTime.now().minusHours(1),
                            true
                    ),
                    new ChatMessage(
                            null,
                            "elena",
                            "Elena Rostova",
                            "HR Lead Manager",
                            "sarah",
                            "Sarah Connor",
                            null, // direct message
                            "GENERAL",
                            "Hi Sarah, could you please review the new technical lead onboarding checklist when you get a chance?",
                            LocalDateTime.now().minusMinutes(45),
                            false
                    ),
                    new ChatMessage(
                            null,
                            "sarah",
                            "Sarah Connor",
                            "Principal Engineer",
                            "elena",
                            "Elena Rostova",
                            null, // direct message
                            "GENERAL",
                            "Sure thing Elena! I'll go through it right after the sprint review meeting.",
                            LocalDateTime.now().minusMinutes(20),
                            true
                    )
            );

            messageRepo.saveAll(sampleMessages);
            System.out.println(">>> DataInitializer: Seeded " + sampleMessages.size() + " official communication messages.");
        }
    }
}
