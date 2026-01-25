package com.online_clipboard_backend.service;

import com.online_clipboard_backend.dto.ClipDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClipService {
    ClipDto createClip(ClipDto clipDto);

    ClipDto getClip(String code);

    List<ClipDto> getUserClips(String username , Pageable pageable);

    ClipDto deleteById(Long id);


    ClipDto updateById(Long id, ClipDto clipDto);

    List<ClipDto> getPublicClip(Pageable pageable);
}
