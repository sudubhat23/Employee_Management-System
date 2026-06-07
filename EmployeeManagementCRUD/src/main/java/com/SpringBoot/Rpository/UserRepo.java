package com.SpringBoot.Rpository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.SpringBoot.entity.User;

public interface UserRepo extends JpaRepository<User, Integer> {

	 User findByUsername(String username);
		// TODO Auto-generated method stub
	
	}



