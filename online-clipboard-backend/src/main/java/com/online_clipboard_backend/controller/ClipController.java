package com.online_clipboard_backend.controller;


import com.online_clipboard_backend.dto.ClipDto;

import com.online_clipboard_backend.service.ClipService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

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
    public List<ClipDto> getUserClips(@PathVariable String username) {
        return clipService.getUserClips(username);
    }

    @DeleteMapping("/{id}")
    public ClipDto deleteClip(@PathVariable Long id) {
        return clipService.deleteById(id);
    }

    @PutMapping("/{id}")
    public ClipDto updateClip(@PathVariable Long id , @RequestBody ClipDto clipDto) {
        return clipService.updateById(id , clipDto);
    }


}
