package com.SpringBoot.dto;

import java.util.Map;

public class EmployeeStatsResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long onLeaveEmployees;
    private long totalDepartments;
    private double averageSalary;
    private double totalMonthlyPayroll;
    private Map<String, Long> departmentCounts;

    public EmployeeStatsResponse() {}

    public EmployeeStatsResponse(long totalEmployees, long activeEmployees, long onLeaveEmployees, 
                                 long totalDepartments, double averageSalary, double totalMonthlyPayroll, 
                                 Map<String, Long> departmentCounts) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.onLeaveEmployees = onLeaveEmployees;
        this.totalDepartments = totalDepartments;
        this.averageSalary = averageSalary;
        this.totalMonthlyPayroll = totalMonthlyPayroll;
        this.departmentCounts = departmentCounts;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getOnLeaveEmployees() { return onLeaveEmployees; }
    public void setOnLeaveEmployees(long onLeaveEmployees) { this.onLeaveEmployees = onLeaveEmployees; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public double getAverageSalary() { return averageSalary; }
    public void setAverageSalary(double averageSalary) { this.averageSalary = averageSalary; }

    public double getTotalMonthlyPayroll() { return totalMonthlyPayroll; }
    public void setTotalMonthlyPayroll(double totalMonthlyPayroll) { this.totalMonthlyPayroll = totalMonthlyPayroll; }

    public Map<String, Long> getDepartmentCounts() { return departmentCounts; }
    public void setDepartmentCounts(Map<String, Long> departmentCounts) { this.departmentCounts = departmentCounts; }
}
