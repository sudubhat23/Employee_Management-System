package com.SpringBoot.configuration;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.User;

@Service
public class MyUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepo userRepository;
		
		public MyUserDetailsService(UserRepo userRepository)
		{
			this.userRepository = userRepository;
		}
		
		 public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		        User user = userRepository.findByUsername(username);
		        System.out.println("security usernam "+ username);
		        
		        if(user == null)
		        {
		        	throw new UsernameNotFoundException("This user doent not exist in the DB");
		        }
		       System.out.println("User from DB "+user);
		       
		      return new UserPrinciple(user);
		       
		    }
	}

