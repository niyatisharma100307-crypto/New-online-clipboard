package com.online_clipboard_backend.controller;


import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jwt.JWTClaimsSet;
import com.online_clipboard_backend.dto.UserDto;
import com.online_clipboard_backend.dto.UserPasswordUpdate;
import com.online_clipboard_backend.security.JwtService;
import com.online_clipboard_backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping()
    public UserDto createUser(@RequestBody UserDto userDto) {
        return userService.createUser(userDto);
    }

    @PostMapping("/updatePassword")
    public UserDto updatePassword(@RequestBody UserPasswordUpdate userDto){
        return userService.updatePassword(userDto) ;
    }

    @PostMapping("/clerk")
    public UserDto createOrGetClerkUser(HttpServletRequest request, @RequestBody(required = false) UserDto userDto) throws Exception {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = auth.substring(7);
        JWTClaimsSet claims = jwtService.validate(token);

        String clerkId = claims.getSubject();
        String email = userDto != null && userDto.getEmail() != null ? userDto.getEmail() : (String) claims.getClaim("email");
        String username = userDto != null && userDto.getUsername() != null ? userDto.getUsername() : (String) claims.getClaim("preferred_username");
        String avatarUrl = userDto != null ? userDto.getAvatarUrl() : null;

        return userService.createOrGetClerkUser(clerkId, email, username, avatarUrl);
    }

    @PatchMapping("/username")
    public UserDto updateUsername(HttpServletRequest request, @RequestBody UserDto userDto) throws Exception {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = auth.substring(7);
        JWTClaimsSet claims = jwtService.validate(token);

        return userService.updateClerkUsername(claims.getSubject(), userDto.getUsername());
    }

}
