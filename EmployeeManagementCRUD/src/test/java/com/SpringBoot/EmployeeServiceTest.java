package com.SpringBoot;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepo employeeRepo;

    @InjectMocks
    private EmployeeService employeeService;

    private EmployeeEntity employee;

    @BeforeEach
    void setUp() {
        employee = new EmployeeEntity(1, "John", "Doe", "john.doe@company.com", "+1-555-1234", 30, "Engineering", "Software Engineer", 90000.0, "ACTIVE", null, "https://avatar.url");
    }

    @Test
    void testAddEmployee() {
        when(employeeRepo.save(any(EmployeeEntity.class))).thenReturn(employee);

        EmployeeEntity created = employeeService.addEmployee(employee);

        assertNotNull(created);
        assertEquals("John", created.getFirstName());
        assertEquals("Engineering", created.getDept());
        verify(employeeRepo, times(1)).save(any(EmployeeEntity.class));
    }

    @Test
    void testGetEmpById() {
        when(employeeRepo.findById(1)).thenReturn(Optional.of(employee));

        Optional<EmployeeEntity> found = employeeService.getEmpById(1);

        assertTrue(found.isPresent());
        assertEquals("john.doe@company.com", found.get().getEmail());
    }

    @Test
    void testSelfUpdateEmployee_RestrictsSalaryAndDeptTampering() {
        when(employeeRepo.findById(1)).thenReturn(Optional.of(employee));
        when(employeeRepo.save(any(EmployeeEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Employee attempts to update phone and bio, but also attempts to alter salary to 500,000 and role to CEO
        EmployeeEntity maliciousUpdate = new EmployeeEntity();
        maliciousUpdate.setPhone("+1-555-9999");
        maliciousUpdate.setBio("Updated personal bio");
        maliciousUpdate.setSalary(500000.0); // Should be ignored
        maliciousUpdate.setRole("CEO"); // Should be ignored

        EmployeeEntity result = employeeService.selfUpdateEmployee(1, maliciousUpdate);

        assertNotNull(result);
        assertEquals("+1-555-9999", result.getPhone());
        assertEquals("Updated personal bio", result.getBio());
        // Verify salary and role were protected and NOT modified
        assertEquals(90000.0, result.getSalary());
        assertEquals("Software Engineer", result.getRole());
    }

    @Test
    void testDeleteEmployee() {
        when(employeeRepo.existsById(1)).thenReturn(true);
        doNothing().when(employeeRepo).deleteById(1);

        Boolean deleted = employeeService.deleteEmployee(1);

        assertTrue(deleted);
        verify(employeeRepo, times(1)).deleteById(1);
    }
}
