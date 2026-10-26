package com.SpringBoot.Rpository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.SpringBoot.entity.EmployeeEntity;

@Repository
public interface EmployeeRepo extends JpaRepository<EmployeeEntity, Integer> {

    java.util.Optional<EmployeeEntity> findByEmailIgnoreCase(String email);

    Page<EmployeeEntity> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDeptContainingIgnoreCase(
        String fn, String ln, String email, String dept, Pageable pageable
    );

    Page<EmployeeEntity> findByDeptIgnoreCase(String dept, Pageable pageable);

    Page<EmployeeEntity> findByStatusIgnoreCase(String status, Pageable pageable);

    List<EmployeeEntity> findTop5ByOrderByJoiningDateDesc();

    long countByStatus(String status);

    @Query("SELECT e.dept, COUNT(e), SUM(e.salary) FROM EmployeeEntity e GROUP BY e.dept")
    List<Object[]> getDepartmentStats();

    @Query("SELECT AVG(e.salary) FROM EmployeeEntity e")
    Double getAverageSalary();

    @Query("SELECT SUM(e.salary) FROM EmployeeEntity e")
    Double getTotalSalaryExpense();
}