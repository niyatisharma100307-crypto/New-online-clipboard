package com.online_clipboard_backend.service.impl;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.online_clipboard_backend.dto.ClipDto;
import com.online_clipboard_backend.entity.Clip;
import com.online_clipboard_backend.entity.User;
import com.online_clipboard_backend.repository.ClipRepository;
import com.online_clipboard_backend.repository.UserRepository;
import com.online_clipboard_backend.service.ClipService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClipServiceImpl implements ClipService {

    private final ClipRepository clipRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final Cloudinary cloudinary;

    @Value("${app.secret-key}")
    private String secretKey;

    private SecretKeySpec secretKeySpec;

    private SecretKeySpec getSecretKeySpec() {
        if (secretKeySpec == null) {
            secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
        }
        return secretKeySpec;
    }

    private String encrypt(String content) {
        try {
            if (content == null) return null;
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKeySpec());
            return Base64.getEncoder().encodeToString(cipher.doFinal(content.getBytes()));

        } catch (GeneralSecurityException e) {
            throw new RuntimeException(e.toString());
        }
    }

    private String decrypt(String content) {
        try {
            if (content == null || content.isEmpty()) return content;
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, getSecretKeySpec());
            return new String(cipher.doFinal(Base64.getDecoder().decode(content)));

        } catch (GeneralSecurityException e) {

            return content;
        }
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "publicClips", allEntries = true),
            @CacheEvict(value = "publicUserClips", allEntries = true)
    })
    public ClipDto createClip(ClipDto clipDto) {
        String randomCode;
        Random random = new Random();

        do {
            int number = random.nextInt(100000);
            randomCode = String.format("%05d", number);
        } while (clipRepository.findByCode(randomCode).isPresent());

        clipDto.setCode(randomCode);

        Clip clip = modelMapper.map(clipDto, Clip.class);

        String rawContent = clip.getContent();

        if (rawContent != null && rawContent.startsWith("data:")) {
            try {

                String resourceType = "raw";
                String ext = "";


                if (rawContent.startsWith("data:image/")) {
                    resourceType = "image";
                    if (rawContent.contains("png")) ext = ".png";
                    else if (rawContent.contains("jpeg") || rawContent.contains("jpg")) ext = ".jpg";
                } else if (rawContent.contains("application/pdf")) {
                    ext = ".pdf";
                } else if (rawContent.contains("zip") || rawContent.contains("compressed")) {
                    ext = ".zip";
                }


                Map<String, Object> params = ObjectUtils.asMap(
                        "resource_type", resourceType
                );

                Map uploadResult = cloudinary.uploader().upload(rawContent, params);

                String fileUrl = uploadResult.get("secure_url").toString();

                String publicId = uploadResult.get("public_id").toString();

                clip.setCloudinaryPublicId(publicId);
                clip.setCloudinaryResourceType(resourceType);

                clip.setContent("FILE_URL:" + ext + "|" + fileUrl);

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage());
            }
        }


        clip.setContent(encrypt(clip.getContent()));

        if (clipDto.getUsername() != null && !clipDto.getUsername().isEmpty()) {
            User user = userRepository.findByUsername(clipDto.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            clip.setUser(user);
        }

        Clip savedClip = clipRepository.save(clip);

        ClipDto responseDto = modelMapper.map(savedClip, ClipDto.class);
        responseDto.setContent(decrypt(savedClip.getContent()));

        if (savedClip.getUser() != null) {
            responseDto.setUsername(savedClip.getUser().getUsername());
            responseDto.setAvatarUrl(savedClip.getUser().getAvatarUrl());
        }
        return responseDto;
    }

    @Override
    @Cacheable(value = "clips", key = "#code")
    public ClipDto getClip(String code) {
        Clip clip = clipRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Clip not found"));

        ClipDto responseDto = modelMapper.map(clip, ClipDto.class);
        responseDto.setContent(decrypt(clip.getContent()));

        if (clip.getUser() != null) {
            responseDto.setUsername(clip.getUser().getUsername());
            responseDto.setAvatarUrl(clip.getUser().getAvatarUrl());
        }
        return responseDto;
    }

    @Override
    public List<ClipDto> getUserClips(String username, Pageable pageable) {

        List<Clip> clips = clipRepository.findAllByUser_Username(username, pageable);

        return clips.stream().map(clip -> {
            ClipDto dto = modelMapper.map(clip, ClipDto.class);
            dto.setContent(decrypt(clip.getContent()));
            dto.setUsername(username);
            if (clip.getUser() != null) {
                dto.setAvatarUrl(clip.getUser().getAvatarUrl());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "clips", key = "#result.code"), // Removes the specific clip by its code
            @CacheEvict(value = "publicClips", allEntries = true),
            @CacheEvict(value = "publicUserClips", allEntries = true)
    })
    public ClipDto deleteById(Long id) {
        Clip clip = clipRepository.findById(id).orElseThrow(() -> new RuntimeException("Clip not found"));


        if (clip.getCloudinaryPublicId() != null) {
            try {
                cloudinary.uploader().destroy(
                        clip.getCloudinaryPublicId(),
                        ObjectUtils.asMap("resource_type", clip.getCloudinaryResourceType())
                );
            } catch (IOException e) {
                System.err.println("Manual Cloudinary delete failed: " + e.getMessage());
            }
        }

        ClipDto deletedClip = modelMapper.map(clip, ClipDto.class);
        deletedClip.setContent(decrypt(clip.getContent()));
        clipRepository.deleteById(id);
        return deletedClip;

    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "clips", key = "#result.code"),
            @CacheEvict(value = "publicClips", allEntries = true),
            @CacheEvict(value = "publicUserClips", allEntries = true)
    })
    public ClipDto updateById(Long id, ClipDto clipDto) {
        Clip oldClip = clipRepository.findById(id).orElseThrow();
        oldClip.setContent(encrypt(clipDto.getContent()));

        Clip newClip = clipRepository.save(oldClip);

        ClipDto response = modelMapper.map(newClip, ClipDto.class);
        response.setContent(decrypt(newClip.getContent()));
        return response;
    }

    @Override
    @Cacheable(value = "publicClips", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public List<ClipDto> getPublicClip(Pageable pageable) {
        List<Clip> clips = clipRepository.findByVisibleTrueOrderByCreatedAtDesc(pageable);
        return clips.stream().map(clip -> {
            ClipDto dto = modelMapper.map(clip, ClipDto.class);
            dto.setContent(decrypt(clip.getContent()));
            if (clip.getUser() != null)
                dto.setUsername(clip.getUser().getUsername());
            if (clip.getUser() != null)
                dto.setAvatarUrl(clip.getUser().getAvatarUrl());
            return dto;
        }).toList();
    }

    @Override
    @Cacheable(value = "publicUserClips", key = "#username + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public List<ClipDto> getPublicUserClips(String username, Pageable pageable) {
        userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        List<Clip> clips = clipRepository.findAllByUser_UsernameAndVisibleTrue(username, pageable);

        return clips.stream().map(clip -> {
            ClipDto dto = modelMapper.map(clip, ClipDto.class);
            dto.setContent((decrypt(clip.getContent())));
            if (clip.getUser() != null) {
                dto.setUsername(clip.getUser().getUsername());
                dto.setAvatarUrl(clip.getUser().getAvatarUrl());
            }
            return dto;
        }).toList();
    }


}