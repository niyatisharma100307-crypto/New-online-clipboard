package com.online_clipboard_backend.repository;

import com.online_clipboard_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User , Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByClerkId(String clerkId);

}
