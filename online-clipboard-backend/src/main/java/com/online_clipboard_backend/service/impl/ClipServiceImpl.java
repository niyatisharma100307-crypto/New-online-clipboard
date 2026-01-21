package com.online_clipboard_backend.service.impl;

import com.online_clipboard_backend.dto.ClipDto;
import com.online_clipboard_backend.entity.Clip;
import com.online_clipboard_backend.entity.User;
import com.online_clipboard_backend.repository.ClipRepository;
import com.online_clipboard_backend.repository.UserRepository;
import com.online_clipboard_backend.service.ClipService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClipServiceImpl implements ClipService {

    private final ClipRepository clipRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Value("${app.secret-key}")
    private String secretKey;

    private String encrypt(String content) {
        try {
            if (content == null) return null;
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            return Base64.getEncoder().encodeToString(cipher.doFinal(content.getBytes()));

        } catch (Exception e) {
            throw new RuntimeException(e.toString());
        }
    }

    private String decrypt(String content) {
        try {
            if (content == null) return null;
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            return new String(cipher.doFinal(Base64.getDecoder().decode(content)));

        } catch (Exception e) {
            throw new RuntimeException(e.toString());
        }
    }

    @Override
    public ClipDto createClip(ClipDto clipDto) {

        String randomCode;
        Random random = new Random();

        do {
            int number = random.nextInt(100000);
            randomCode = String.format("%05d", number);

        } while (clipRepository.findByCode(randomCode).isPresent());

        clipDto.setCode(randomCode);

        Clip clip = modelMapper.map(clipDto, Clip.class);
        clip.setContent(encrypt(clip.getContent()));


        if (clipDto.getUsername() != null && !clipDto.getUsername().isEmpty()) {
            User user = userRepository.findByUsername(clipDto.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
            clip.setUser(user);
        }


        Clip savedClip = clipRepository.save(clip);

        ClipDto responseDto = modelMapper.map(savedClip, ClipDto.class);
        responseDto.setContent(decrypt(responseDto.getContent()));
        if (savedClip.getUser() != null) {
            responseDto.setUsername(savedClip.getUser().getUsername());
        }
        return responseDto;
    }

    @Override
    public ClipDto getClip(String code) {
        Clip clip = clipRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Clip not found"));

        ClipDto responseDto = modelMapper.map(clip, ClipDto.class);
        responseDto.setContent(decrypt(clip.getContent()));

        if (clip.getUser() != null) {
            responseDto.setUsername(clip.getUser().getUsername());
        }
        return responseDto;
    }

    @Override
    public List<ClipDto> getUserClips(String username) {

        List<Clip> clips = clipRepository.findAllByUser_Username(username);

        return clips.stream().map(clip -> {
            ClipDto dto = modelMapper.map(clip, ClipDto.class);
            dto.setContent(decrypt(clip.getContent()));
            dto.setUsername(username);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ClipDto deleteById(Long id) {
        Clip clip = clipRepository.findById(id).orElseThrow(() -> new RuntimeException("Clip not found"));
        ClipDto deletedClip = modelMapper.map(clip, ClipDto.class);
        deletedClip.setContent(decrypt(clip.getContent()));
        clipRepository.deleteById(id);
        return deletedClip;

    }

    @Override
    public ClipDto updateById(Long id, ClipDto clipDto) {
        Clip oldClip = clipRepository.findById(id).orElseThrow();
        oldClip.setContent(encrypt(clipDto.getContent()));

        Clip newClip = clipRepository.save(oldClip);

        ClipDto response = modelMapper.map(newClip, ClipDto.class);
        response.setContent(decrypt(newClip.getContent()));
        return response ;
    }

    @Override
    public List<ClipDto> getPublicClip() {
        List<Clip> clips = clipRepository.findByVisibleTrueOrderByCreatedAtDesc();
        return clips.stream().map(clip -> {
            ClipDto dto = modelMapper.map(clip, ClipDto.class);
            dto.setContent(decrypt(clip.getContent()));
            if(clip.getUser() != null)
                dto.setUsername(clip.getUser().getUsername());
            return dto;
        }).toList();
    }


}