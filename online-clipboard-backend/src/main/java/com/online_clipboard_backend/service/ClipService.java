package com.online_clipboard_backend.service;

import com.online_clipboard_backend.dto.ClipDto;

import java.util.List;

public interface ClipService {
    ClipDto createClip(ClipDto clipDto);

    ClipDto getClip(String code);

    List<ClipDto> getUserClips(String username);

    ClipDto deleteById(Long id);


    ClipDto updateById(Long id, ClipDto clipDto);
}
