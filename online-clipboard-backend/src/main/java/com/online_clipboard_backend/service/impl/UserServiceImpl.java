package com.online_clipboard_backend.service.impl;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.dto.UserPasswordUpdate;
import com.online_clipboard_backend.entity.User;
import com.online_clipboard_backend.repository.UserRepository;
import com.online_clipboard_backend.service.UserService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto createUser(UserDto userDto) {
        Optional<User> user = userRepository.findByUsername(userDto.getUsername());

        if (user.isEmpty()) {
            User newUser = modelMapper.map(userDto, User.class);
            newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
            User savedUser = userRepository.save(newUser);
            return modelMapper.map(savedUser, UserDto.class);
        } else {

            User existingUser = user.get();

            if (passwordEncoder.matches(userDto.getPassword(), existingUser.getPassword())) {
                return modelMapper.map(existingUser, UserDto.class);
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
            }
        }
    }

    @Override
    public UserDto updatePassword(UserPasswordUpdate userDto) {
        User user = userRepository.findByUsername(userDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(userDto.getOldPassword(), user.getPassword())){
            String newPassword = passwordEncoder.encode(userDto.getNewPassword());
            user.setPassword(newPassword);
           User updatedUser = userRepository.save(user);
           return modelMapper.map(updatedUser , UserDto.class) ;
        } else {
            throw new RuntimeException("Password does not match");
        }
    }

    @Override
    public UserDto createOrGetClerkUser(String clerkId, String email, String username, String avatarUrl) {
        Optional<User> existing = userRepository.findByClerkId(clerkId);
        if (existing.isPresent()) {
            User user = existing.get();
            if (email != null && !email.isBlank()) {
                user.setEmail(email);
            }
            if (avatarUrl != null && !avatarUrl.isBlank()) {
                user.setAvatarUrl(avatarUrl);
            }
            User savedUser = userRepository.save(user);
            return modelMapper.map(savedUser, UserDto.class);
        }

        // If username collides, append short suffix
        String baseUsername = (username == null || username.isBlank()) ? (email != null ? email.split("@")[0] : clerkId) : username;
        String finalUsername = baseUsername;
        int suffix = 1;
        while (userRepository.findByUsername(finalUsername).isPresent()) {
            finalUsername = baseUsername + suffix;
            suffix++;
        }

        User newUser = new User();
        newUser.setUsername(finalUsername);
        newUser.setPassword(null);
        newUser.setClerkId(clerkId);
        newUser.setEmail(email);
        newUser.setAvatarUrl(avatarUrl);
        User saved = userRepository.save(newUser);
        return modelMapper.map(saved, UserDto.class);
    }

    @Override
    public UserDto updateClerkUsername(String clerkId, String username) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username cannot be empty");
        }

        User user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.findByUsername(username).ifPresent(existing -> {
            if (!existing.getId().equals(user.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
            }
        });

        user.setUsername(username.trim());
        User updated = userRepository.save(user);
        return modelMapper.map(updated, UserDto.class);
    }


}
