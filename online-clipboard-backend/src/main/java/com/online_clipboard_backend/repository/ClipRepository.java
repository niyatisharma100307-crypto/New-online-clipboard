package com.online_clipboard_backend.repository;

import com.online_clipboard_backend.entity.Clip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface ClipRepository extends JpaRepository<Clip, Long> {

    Optional<Clip> findByCode(String code);

    List<Clip> findAllByUser_Username(String username);

    void deleteByCreatedAtBefore(LocalDateTime expiryDate);

    List<Clip> findByVisibleTrueOrderByCreatedAtDesc ();

}
