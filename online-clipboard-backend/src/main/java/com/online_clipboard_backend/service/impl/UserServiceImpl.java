package com.online_clipboard_backend.service.impl;

import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.entity.User;
import com.online_clipboard_backend.repository.UserRepository;
import com.online_clipboard_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public UserDto createUser(UserDto userDto) {
        Optional<User> user = userRepository.findByUsername(userDto.getUsername());

        if (user.isEmpty()) {
            User newUser = modelMapper.map(userDto, User.class);
            User savedUser = userRepository.save(newUser);
            return modelMapper.map(savedUser, UserDto.class);
        } else {

            User existingUser = user.get();

            if (userDto.getPassword().equals(existingUser.getPassword())) {
                return modelMapper.map(existingUser, UserDto.class);
            } else {
                throw new RuntimeException("Invalid password or username");
            }
        }
    }
}
