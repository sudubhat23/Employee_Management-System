package com.SpringBoot.configuration;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin User if none exists
        if (userRepo.count() == 0) {
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
            System.out.println(">>> DataInitializer: Default admin user created (username: admin, password: admin123)");
        }

        // Seed initial employees if repository is empty
        if (employeeRepo.count() == 0) {
            List<EmployeeEntity> sampleEmployees = Arrays.asList(
                    new EmployeeEntity(null, "Sarah", "Connor", "sarah.connor@techcorp.com", "+1-555-0101", 32, "Engineering", "Principal Engineer", 125000.0, "ACTIVE", LocalDate.of(2021, 3, 15), "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"),
                    new EmployeeEntity(null, "Alexander", "Wright", "alex.wright@techcorp.com", "+1-555-0102", 28, "Engineering", "Senior FullStack Developer", 110000.0, "ACTIVE", LocalDate.of(2022, 6, 1), "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"),
                    new EmployeeEntity(null, "Elena", "Rostova", "elena.r@techcorp.com", "+1-555-0103", 35, "Human Resources", "HR Lead Manager", 92000.0, "ACTIVE", LocalDate.of(2020, 1, 10), "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"),
                    new EmployeeEntity(null, "David", "Kim", "david.kim@techcorp.com", "+1-555-0104", 26, "Design", "UI/UX Designer", 85000.0, "ACTIVE", LocalDate.of(2023, 2, 20), "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"),
                    new EmployeeEntity(null, "Jessica", "Taylor", "jessica.t@techcorp.com", "+1-555-0105", 41, "Finance", "Chief Financial Analyst", 135000.0, "ACTIVE", LocalDate.of(2019, 11, 5), "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"),
                    new EmployeeEntity(null, "Marcus", "Vance", "marcus.vance@techcorp.com", "+1-555-0106", 30, "Marketing", "Growth Marketing Lead", 88000.0, "ON_LEAVE", LocalDate.of(2022, 9, 12), "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"),
                    new EmployeeEntity(null, "Priya", "Sharma", "priya.sharma@techcorp.com", "+1-555-0107", 29, "Engineering", "DevOps Engineer", 105000.0, "ACTIVE", LocalDate.of(2023, 1, 15), "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
                    new EmployeeEntity(null, "Michael", "Brown", "michael.b@techcorp.com", "+1-555-0108", 45, "Sales", "VP of Global Sales", 145000.0, "ACTIVE", LocalDate.of(2018, 4, 1), "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150")
            );

            employeeRepo.saveAll(sampleEmployees);
            System.out.println(">>> DataInitializer: Preloaded " + sampleEmployees.size() + " sample employees into database.");
        }
    }
}
