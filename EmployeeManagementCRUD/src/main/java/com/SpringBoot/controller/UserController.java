package com.SpringBoot.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.dto.AuthResponse;
import com.SpringBoot.entity.LoginRequest;
import com.SpringBoot.entity.User;
import com.SpringBoot.security.JwtUtils;
import com.SpringBoot.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "User Authentication API", description = "Endpoints for user registration, authentication, and JWT issuance")
public class UserController {

    private final UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private com.SpringBoot.Rpository.EmployeeRepo employeeRepo;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get all registered users")
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Integer id) {
        return userService.getUser(id);
    }

    @Operation(summary = "Update user profile")
    @PutMapping("/user/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Integer id) {
        user.setId(id);
        return userService.updateUser(user);
    }

    @Operation(summary = "Register new account")
    @PostMapping("/register")
    public ResponseEntity<?> newUser(@RequestBody User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }
        User newUser = userService.addUser(user);
        String token = jwtUtils.generateToken(newUser.getUsername());

        Integer empId = newUser.getEmployeeId();
        if (empId == null && newUser.getEmail() != null) {
            employeeRepo.findByEmailIgnoreCase(newUser.getEmail()).ifPresent(e -> newUser.setEmployeeId(e.getId()));
            empId = newUser.getEmployeeId();
        }

        AuthResponse authResponse = new AuthResponse(
                token,
                newUser.getId(),
                newUser.getUsername(),
                newUser.getEmail(),
                newUser.getFirstname(),
                newUser.getLastname(),
                newUser.getRole(),
                empId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @Operation(summary = "Delete user account")
    @DeleteMapping("/user/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @Operation(summary = "Authenticate user & issue JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            boolean authenticated = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            if (authenticated) {
                User dbUser = userRepo.findByUsername(loginRequest.getUsername());
                String token = jwtUtils.generateToken(loginRequest.getUsername());

                session.setAttribute("user", loginRequest.getUsername());

                Integer empId = dbUser != null ? dbUser.getEmployeeId() : null;
                if (empId == null && dbUser != null && dbUser.getEmail() != null) {
                    var empOpt = employeeRepo.findByEmailIgnoreCase(dbUser.getEmail());
                    if (empOpt.isPresent()) {
                        empId = empOpt.get().getId();
                        dbUser.setEmployeeId(empId);
                        userRepo.save(dbUser);
                    }
                }

                AuthResponse authResponse = new AuthResponse(
                        token,
                        dbUser != null ? dbUser.getId() : 1,
                        loginRequest.getUsername(),
                        dbUser != null ? dbUser.getEmail() : loginRequest.getUsername() + "@company.com",
                        dbUser != null ? dbUser.getFirstname() : "Admin",
                        dbUser != null ? dbUser.getLastname() : "User",
                        dbUser != null ? dbUser.getRole() : "ROLE_ADMIN",
                        empId
                );

                return ResponseEntity.ok(authResponse);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
