package com.SpringBoot.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.dto.EmployeeStatsResponse;
import com.SpringBoot.entity.EmployeeEntity;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    public EmployeeEntity addEmployee(EmployeeEntity employee) {
        if (employee.getEmail() == null || employee.getEmail().isBlank()) {
            String sanitized = (employee.getName() != null ? employee.getName() : "user")
                    .toLowerCase().replaceAll("[^a-z0-9]", "");
            employee.setEmail(sanitized + System.currentTimeMillis() % 1000 + "@company.com");
        }
        return employeeRepo.save(employee);
    }

    public List<EmployeeEntity> getAllEmployees() {
        return employeeRepo.findAll();
    }

    public Optional<EmployeeEntity> getEmpById(Integer id) {
        return employeeRepo.findById(id);
    }

    public EmployeeEntity updateEmployee(EmployeeEntity updateEmp) {
        Optional<EmployeeEntity> existingOpt = employeeRepo.findById(updateEmp.getId());
        if (existingOpt.isPresent()) {
            EmployeeEntity existing = existingOpt.get();
            if (updateEmp.getFirstName() != null) existing.setFirstName(updateEmp.getFirstName());
            if (updateEmp.getLastName() != null) existing.setLastName(updateEmp.getLastName());
            if (updateEmp.getEmail() != null) existing.setEmail(updateEmp.getEmail());
            if (updateEmp.getPhone() != null) existing.setPhone(updateEmp.getPhone());
            if (updateEmp.getAge() != null) existing.setAge(updateEmp.getAge());
            if (updateEmp.getDept() != null) existing.setDept(updateEmp.getDept());
            if (updateEmp.getRole() != null) existing.setRole(updateEmp.getRole());
            if (updateEmp.getSalary() != null) existing.setSalary(updateEmp.getSalary());
            if (updateEmp.getStatus() != null) existing.setStatus(updateEmp.getStatus());
            if (updateEmp.getAvatarUrl() != null) existing.setAvatarUrl(updateEmp.getAvatarUrl());
            if (updateEmp.getBio() != null) existing.setBio(updateEmp.getBio());
            if (updateEmp.getSkills() != null) existing.setSkills(updateEmp.getSkills());
            if (updateEmp.getEmergencyContact() != null) existing.setEmergencyContact(updateEmp.getEmergencyContact());
            if (updateEmp.getAddress() != null) existing.setAddress(updateEmp.getAddress());

            return employeeRepo.save(existing);
        }
        return employeeRepo.save(updateEmp);
    }

    /**
     * Self-service employee update: only permits non-administrative personal fields
     */
    public EmployeeEntity selfUpdateEmployee(Integer id, EmployeeEntity update) {
        Optional<EmployeeEntity> existingOpt = employeeRepo.findById(id);
        if (existingOpt.isPresent()) {
            EmployeeEntity existing = existingOpt.get();
            if (update.getFirstName() != null && !update.getFirstName().isBlank()) existing.setFirstName(update.getFirstName());
            if (update.getLastName() != null && !update.getLastName().isBlank()) existing.setLastName(update.getLastName());
            if (update.getPhone() != null) existing.setPhone(update.getPhone());
            if (update.getAge() != null) existing.setAge(update.getAge());
            if (update.getAvatarUrl() != null) existing.setAvatarUrl(update.getAvatarUrl());
            if (update.getBio() != null) existing.setBio(update.getBio());
            if (update.getSkills() != null) existing.setSkills(update.getSkills());
            if (update.getEmergencyContact() != null) existing.setEmergencyContact(update.getEmergencyContact());
            if (update.getAddress() != null) existing.setAddress(update.getAddress());

            return employeeRepo.save(existing);
        }
        return null;
    }

    public Boolean deleteEmployee(Integer id) {
        if (employeeRepo.existsById(id)) {
            employeeRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<EmployeeEntity> searchAndFilterEmployees(
            String search, String dept, String status, 
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            String term = search.trim();
            return employeeRepo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDeptContainingIgnoreCase(
                    term, term, term, term, pageable);
        }

        if (dept != null && !dept.trim().isEmpty() && !dept.equalsIgnoreCase("ALL")) {
            return employeeRepo.findByDeptIgnoreCase(dept.trim(), pageable);
        }

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            return employeeRepo.findByStatusIgnoreCase(status.trim(), pageable);
        }

        return employeeRepo.findAll(pageable);
    }

    public EmployeeStatsResponse getEmployeeStats() {
        List<EmployeeEntity> all = employeeRepo.findAll();
        long total = all.size();
        long active = all.stream().filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus())).count();
        long onLeave = all.stream().filter(e -> "ON_LEAVE".equalsIgnoreCase(e.getStatus())).count();

        Map<String, Long> deptCounts = all.stream()
                .filter(e -> e.getDept() != null)
                .collect(Collectors.groupingBy(EmployeeEntity::getDept, Collectors.counting()));

        long deptTotalCount = deptCounts.keySet().size();

        double avgSalary = all.isEmpty() ? 0.0 :
                all.stream().mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0.0).average().orElse(0.0);

        double totalPayroll = all.stream()
                .mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0.0).sum();

        return new EmployeeStatsResponse(total, active, onLeave, deptTotalCount, avgSalary, totalPayroll, deptCounts);
    }

    public ByteArrayInputStream exportEmployeesToCsv() {
        List<EmployeeEntity> employees = employeeRepo.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(out, true, StandardCharsets.UTF_8);

        // Write CSV Header
        pw.println("ID,First Name,Last Name,Email,Phone,Department,Role,Salary,Status,Joining Date");

        for (EmployeeEntity emp : employees) {
            pw.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\",\"%s\"%n",
                    emp.getId(),
                    emp.getFirstName() != null ? emp.getFirstName() : "",
                    emp.getLastName() != null ? emp.getLastName() : "",
                    emp.getEmail() != null ? emp.getEmail() : "",
                    emp.getPhone() != null ? emp.getPhone() : "",
                    emp.getDept() != null ? emp.getDept() : "",
                    emp.getRole() != null ? emp.getRole() : "",
                    emp.getSalary() != null ? emp.getSalary() : 0.0,
                    emp.getStatus() != null ? emp.getStatus() : "",
                    emp.getJoiningDate() != null ? emp.getJoiningDate().toString() : ""
            );
        }

        pw.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }
}
