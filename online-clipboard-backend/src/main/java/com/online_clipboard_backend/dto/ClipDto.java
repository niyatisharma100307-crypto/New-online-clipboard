package com.online_clipboard_backend.dto;


import lombok.Data;

import java.io.Serial;
import java.time.LocalDateTime;
import java.io.Serializable;

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

}
