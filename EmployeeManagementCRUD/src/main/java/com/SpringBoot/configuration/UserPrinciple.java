package com.SpringBoot.configuration;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.SpringBoot.entity.User;

public class UserPrinciple implements UserDetails {
	private User user;
	public UserPrinciple(User user)
	{
		super();
		this.user=user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		String role = user.getRole();
		if (role == null || role.isBlank()) {
			role = "ROLE_EMPLOYEE";
		}
		if (!role.startsWith("ROLE_")) {
			role = "ROLE_" + role;
		}
		return Collections.singleton(new SimpleGrantedAuthority(role));
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}
	
	
	 @Override
	    public boolean isAccountNonExpired() {
	        return UserDetails.super.isAccountNonExpired();
	    }

	    @Override
	    public boolean isAccountNonLocked() {
	        return UserDetails.super.isAccountNonLocked();
	    }

	    @Override
	    public boolean isCredentialsNonExpired() {
	        return UserDetails.super.isCredentialsNonExpired();
	    }

	    @Override
	    public boolean isEnabled() {
	        return UserDetails.super.isEnabled();
	    }


}
