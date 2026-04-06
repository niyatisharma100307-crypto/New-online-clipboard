package com.online_clipboard_backend.controller;


import com.online_clipboard_backend.dto.ClipDto;

import com.online_clipboard_backend.service.ClipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clips")
public class ClipController {
    private final ClipService clipService;


    @PostMapping
    public ClipDto createClip(@RequestBody ClipDto clipDto) {
        return clipService.createClip(clipDto);
    }

    @GetMapping("/{code}")
    public ClipDto getClip(@PathVariable String code) {
        return clipService.getClip(code);
    }

    @GetMapping("/user/{username}")
    public List<ClipDto> getUserClips(@PathVariable String username, @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return clipService.getUserClips(username, pageable);
    }

    @DeleteMapping("/{id}")
    public ClipDto deleteClip(@PathVariable Long id) {
        return clipService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ClipDto updateClip(@PathVariable Long id, @RequestBody ClipDto clipDto) {
        return clipService.updateById(id, clipDto);
    }

    @GetMapping("/public")
    public List<ClipDto> getPublicClip(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return clipService.getPublicClip(pageable);
    }

    @GetMapping("/public/{username}")
    public List<ClipDto> getPublicUserClips(@PathVariable String username, @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return clipService.getPublicUserClips(username, pageable);
    }


}
