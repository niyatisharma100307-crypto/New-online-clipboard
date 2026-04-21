package com.online_clipboard_backend.scheduler;


import com.online_clipboard_backend.repository.ClipRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ClipCleanupScheduler {

    private final ClipRepository clipRepository;

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @CacheEvict(value = {"clips", "publicClips", "publicUserClips"}, allEntries = true)
    public void deleteExpiredClips() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);

        clipRepository.deleteByCreatedAtBefore(cutoffTime);

        System.out.println("System Cleanup: Deleted clips older than 24 hours.");
    }
}
