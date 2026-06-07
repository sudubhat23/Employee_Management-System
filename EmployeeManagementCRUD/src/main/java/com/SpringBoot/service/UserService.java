package com.SpringBoot.service;

import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.User;


@Service
@CrossOrigin(origins="*")
public class UserService {

	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final UserRepo userRepository;
	
	public UserService(UserRepo userRepository , BCryptPasswordEncoder bCryptPasswordEncoder)
	{
		this.userRepository=userRepository;
		this.bCryptPasswordEncoder=bCryptPasswordEncoder;
	}
	
	public List<User> getUsers()
	{
		return userRepository.findAll();
	}
	
	public User getUser(Integer id)
	{
		return userRepository.findById(id).orElse(null);
	}
	
	public User addUser(User user)
	{
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}
	
	public User updateUser(User user)
	{
		return userRepository.save(user);
	}
	
	public void deleteUser(Integer id)
	{
		userRepository.deleteById(id);
	}
	
	// for login to say user is present or not
	
	public boolean authenticate(String username , String password)
	{
		User user = userRepository.findByUsername(username);
		System.out.println("username "+ username);
		System.out.println("user" + user);
		if(user == null)
		{
			throw new UsernameNotFoundException("User not found");
		}
		
		System.out.println("Db password "+ user.getPassword());
		
		boolean matched = bCryptPasswordEncoder.matches(password, user.getPassword());
		
		System.out.println("Password matched "+matched);
		
		if(!matched)
		{
			throw new BadCredentialsException("Wrong password");
		}
		
		return true;
		
	}
	
}
