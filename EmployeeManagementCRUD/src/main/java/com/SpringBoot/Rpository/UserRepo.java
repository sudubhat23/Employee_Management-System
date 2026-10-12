package com.SpringBoot.Rpository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SpringBoot.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
}
