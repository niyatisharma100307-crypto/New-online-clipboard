package com.online_clipboard_backend.service;

import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.dto.UserPasswordUpdate;

public interface UserService {
    UserDto createUser(UserDto userDto);

    UserDto updatePassword(UserPasswordUpdate userDto);
}
