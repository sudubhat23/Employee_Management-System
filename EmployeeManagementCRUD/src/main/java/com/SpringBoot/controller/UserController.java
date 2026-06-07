package com.SpringBoot.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.SpringBoot.entity.LoginRequest;
import com.SpringBoot.entity.User;
import com.SpringBoot.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
public class UserController {

	private UserService userService;
	
	@Autowired
	public UserController(UserService userService)
	{
		this.userService = userService;
	}
	
	@GetMapping("/users")
	public List<User> getUsers()
	{
		return userService.getUsers();
	}
	
	@GetMapping("/user/{id}")
	public User getUser(@PathVariable Integer id)
	{
		return userService.getUser(id);
	}
	
	
	@PutMapping("/user/{id}")
	public User updateUser(@RequestBody User user ,@PathVariable Long id)
	{
		return userService.updateUser(user);
	}
	
	
	@PostMapping("/register")
	public ResponseEntity<User> newUser(@RequestBody User user)
	{
		User newUser=userService.addUser(user);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
	}
	
	
	@DeleteMapping("/user/{id}")
	public void deleteUser(@PathVariable Integer id)
	{
		userService.deleteUser(id);
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest , HttpSession session)
	{
		try {
			boolean authenticated = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
			if(authenticated)
			{
				session.setAttribute("user", loginRequest.getUsername());
				return ResponseEntity.ok("Login successfull");
			}
			
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
}
