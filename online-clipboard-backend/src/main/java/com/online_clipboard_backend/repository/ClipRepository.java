package com.online_clipboard_backend.repository;

import com.online_clipboard_backend.entity.Clip;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface ClipRepository extends JpaRepository<Clip, Long> {

    @EntityGraph(attributePaths = {"user"})
    Optional<Clip> findByCode(String code);

    @EntityGraph(attributePaths = {"user"})
    List<Clip> findAllByUser_Username(String username , Pageable pageable);

    void deleteByCreatedAtBefore(LocalDateTime expiryDate);

    @EntityGraph(attributePaths = {"user"})
    List<Clip> findByVisibleTrueOrderByCreatedAtDesc (Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    List<Clip> findAllByUser_UsernameAndVisibleTrue(String username, Pageable pageable);

    List<Clip> findByCreatedAtBefore(LocalDateTime expiryDate);

}
