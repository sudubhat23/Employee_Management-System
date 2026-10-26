package com.SpringBoot;

import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.User;
import com.SpringBoot.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(1, "Admin", "User", "admin", "admin@company.com", "$2a$10$hashedpassword", "ROLE_ADMIN");
    }

    @Test
    void testAddUserEncodesPassword() {
        User rawUser = new User(null, "Test", "User", "tester", "test@company.com", "rawPass", "ROLE_EMPLOYEE");
        when(passwordEncoder.encode("rawPass")).thenReturn("$2a$10$encoded");
        when(userRepo.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User saved = userService.addUser(rawUser);

        assertNotNull(saved);
        assertEquals("$2a$10$encoded", saved.getPassword());
        verify(passwordEncoder, times(1)).encode("rawPass");
        verify(userRepo, times(1)).save(rawUser);
    }

    @Test
    void testAuthenticateSuccess() {
        when(userRepo.findByUsername("admin")).thenReturn(sampleUser);
        when(passwordEncoder.matches("admin123", "$2a$10$hashedpassword")).thenReturn(true);

        boolean authenticated = userService.authenticate("admin", "admin123");

        assertTrue(authenticated);
    }

    @Test
    void testAuthenticateWrongPassword_ThrowsBadCredentials() {
        when(userRepo.findByUsername("admin")).thenReturn(sampleUser);
        when(passwordEncoder.matches("wrongPass", "$2a$10$hashedpassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            userService.authenticate("admin", "wrongPass");
        });
    }

    @Test
    void testAuthenticateUserNotFound_ThrowsUsernameNotFound() {
        when(userRepo.findByUsername("unknown")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.authenticate("unknown", "pass");
        });
    }
}
