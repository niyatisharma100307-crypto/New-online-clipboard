package com.online_clipboard_backend.entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "clip", indexes = {
    @Index(name = "idx_clip_visible_created_at", columnList = "visible, createdAt DESC"),
    @Index(name = "idx_clip_user_id", columnList = "user_id"),
    @Index(name = "idx_clip_code", columnList = "code")
})
public class Clip {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(unique = true)
    private String code;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean visible ;


}
