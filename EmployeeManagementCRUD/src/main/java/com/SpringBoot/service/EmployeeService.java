package com.SpringBoot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.entity.EmployeeEntity;
@Service
public class EmployeeService {
	 @Autowired
	    private EmployeeRepo employeeRepo;

	    // for creating Employee data

	    public EmployeeEntity addEmployee(EmployeeEntity employee)
	    {
	        return (EmployeeEntity) employeeRepo.save(employee);
	    }


	    // to read all the employee details
	    public List<EmployeeEntity> getAllEmployees()
	    {
	        return employeeRepo.findAll();
	    }

	    // to read single employee data based on id
	    public Optional<EmployeeEntity> getEmpById(Integer id)
	    {
	        return employeeRepo.findById(id);
	    }


	    // for updating the employee data

	    public EmployeeEntity updateEmployee(EmployeeEntity updateEmployee)
	    {
	        Optional<EmployeeEntity> stdid=employeeRepo.findById(updateEmployee.getId());
	        EmployeeEntity e1 = stdid.get();
	        e1.setName(updateEmployee.getName());
	        e1.setAge(updateEmployee.getAge());
	        e1.setDept(updateEmployee.getDept());

	        return (EmployeeEntity) employeeRepo.save(e1);
	    }


	    // to delete employee based on id

	    public Boolean deleteEmployee(Integer id)
	    {
	        employeeRepo.deleteById(id);
	        return true;
	    }


}
