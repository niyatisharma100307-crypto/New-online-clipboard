package com.online_clipboard_backend.service.impl;

import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.entity.User;
import com.online_clipboard_backend.repository.UserRepository;
import com.online_clipboard_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;


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
}
