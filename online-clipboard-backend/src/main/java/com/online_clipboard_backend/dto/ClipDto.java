package com.online_clipboard_backend.dto;


import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ClipDto implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String content;
    private String code;
    private String username;
    private LocalDateTime createdAt;
    private boolean visible;
    private String fileName;
    private String avatarUrl;

}
