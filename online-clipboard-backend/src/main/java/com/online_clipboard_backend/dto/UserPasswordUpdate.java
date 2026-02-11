package com.online_clipboard_backend.dto;

import lombok.Data;

@Data
public class UserPasswordUpdate {

    private String username;
    private String oldPassword;
    private String newPassword;

}
