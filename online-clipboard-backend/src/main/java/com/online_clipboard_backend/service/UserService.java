package com.online_clipboard_backend.service;

import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.dto.UserPasswordUpdate;

public interface UserService {
    UserDto createUser(UserDto userDto);

    UserDto updatePassword(UserPasswordUpdate userDto);

    UserDto createOrGetClerkUser(String clerkId, String email, String username, String avatarUrl);

    UserDto updateClerkUsername(String clerkId, String username);
}
