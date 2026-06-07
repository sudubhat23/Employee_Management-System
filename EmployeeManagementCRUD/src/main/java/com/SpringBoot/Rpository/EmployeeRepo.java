package com.SpringBoot.Rpository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SpringBoot.entity.EmployeeEntity;

public interface EmployeeRepo extends JpaRepository<EmployeeEntity, Integer> {

}