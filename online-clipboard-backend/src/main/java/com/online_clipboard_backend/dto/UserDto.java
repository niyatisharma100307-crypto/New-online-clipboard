package com.online_clipboard_backend.dto;


import lombok.Data;

@Data
public class UserDto {

    private Long id;
    private String username;
    private String password;
    private String clerkId;
    private String email;
    private String avatarUrl;

}
