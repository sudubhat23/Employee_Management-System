package com.SpringBoot.controller;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import com.SpringBoot.configuration.UserPrinciple;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.SpringBoot.dto.EmployeeStatsResponse;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.service.EmployeeService;

@RestController
@RequestMapping("/employee")
@Tag(name = "Employee Management API", description = "Endpoints for managing employee records, statistics, and reports")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Operation(summary = "Create a new employee")
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<EmployeeEntity> addEmployee(@Valid @RequestBody EmployeeEntity employee) {
        EmployeeEntity created = employeeService.addEmployee(employee);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Get all employees (List)")
    @GetMapping("/all")
    public List<EmployeeEntity> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @Operation(summary = "Get paginated, searchable, and filtered employees")
    @GetMapping("/paged")
    public ResponseEntity<Page<EmployeeEntity>> getPagedEmployees(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "ALL") String dept,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Page<EmployeeEntity> result = employeeService.searchAndFilterEmployees(search, dept, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get employee by ID")
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeEntity> getEmpById(@PathVariable Integer id) {
        Optional<EmployeeEntity> emp = employeeService.getEmpById(id);
        return emp.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update employee details")
    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<EmployeeEntity> updateEmployee(@RequestBody EmployeeEntity employee) {
        EmployeeEntity updated = employeeService.updateEmployee(employee);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update employee details by ID")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<EmployeeEntity> updateEmployeeById(@PathVariable Integer id, @RequestBody EmployeeEntity employee) {
        employee.setId(id);
        EmployeeEntity updated = employeeService.updateEmployee(employee);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Self-service update of personal employee details (Employee portal)")
    @PutMapping("/{id}/self-update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeEntity> selfUpdateEmployee(@PathVariable Integer id, @RequestBody EmployeeEntity employee, Authentication auth) {
        // Only admins/managers, or the employee who owns this record, may edit it
        if (!canEditEmployee(auth, id)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        EmployeeEntity updated = employeeService.selfUpdateEmployee(id, employee);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete employee by ID")
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Boolean> deleteEmployee(@PathVariable Integer id) {
        Boolean result = employeeService.deleteEmployee(id);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Delete employee by ID (standard REST)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Boolean> deleteEmployeeById(@PathVariable Integer id) {
        Boolean result = employeeService.deleteEmployee(id);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get Dashboard KPI Statistics")
    @GetMapping("/stats")
    public ResponseEntity<EmployeeStatsResponse> getEmployeeStats() {
        return ResponseEntity.ok(employeeService.getEmployeeStats());
    }

    @Operation(summary = "Export all employee records as CSV download")
    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<InputStreamResource> exportToCsv() {
        ByteArrayInputStream stream = employeeService.exportEmployeesToCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=employees_report.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(new InputStreamResource(stream));
    }

    private boolean canEditEmployee(Authentication auth, Integer employeeId) {
        if (auth == null) return false;
        boolean privileged = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANAGER"));
        if (privileged) return true;
        Object principal = auth.getPrincipal();
        return principal instanceof UserPrinciple p && employeeId.equals(p.getEmployeeId());
    }
}
