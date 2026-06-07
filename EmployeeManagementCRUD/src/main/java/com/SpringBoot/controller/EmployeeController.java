package com.SpringBoot.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.service.EmployeeService;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // Create Employee
    @PostMapping("/add")
    public EmployeeEntity addEmployee(@RequestBody EmployeeEntity employee) {
        return employeeService.addEmployee(employee);
    }

    // Get All Employees
    @GetMapping("/all")
    public List<EmployeeEntity> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Get Employee By ID
    @GetMapping("/{id}")
    public Optional<EmployeeEntity> getEmpById(@PathVariable Integer id) {
        return employeeService.getEmpById(id);
    }

    // Update Employee
    @PutMapping("/update")
    public EmployeeEntity updateEmployee(@RequestBody EmployeeEntity employee) {
        return employeeService.updateEmployee(employee);
    }

    // Delete Employee
    @DeleteMapping("/delete/{id}")
    public Boolean deleteEmployee(@PathVariable Integer id) {
        return employeeService.deleteEmployee(id);
    }
}