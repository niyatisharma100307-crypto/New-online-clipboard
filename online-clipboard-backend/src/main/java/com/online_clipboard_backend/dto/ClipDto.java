package com.online_clipboard_backend.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClipDto {

    private Long id;
    private String content;
    private String code;
    private String username;
    private LocalDateTime createdAt;

}
