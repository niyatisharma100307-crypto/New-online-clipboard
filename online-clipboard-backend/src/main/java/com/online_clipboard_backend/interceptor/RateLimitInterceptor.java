package com.online_clipboard_backend.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {


    private final StringRedisTemplate redisTemplate;


    private static final int MAX_REQUESTS_PER_MINUTE = 30;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {


        String clientIp = request.getRemoteAddr();


        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            clientIp = forwardedFor.split(",")[0];
        }


        String key = "rate_limit:" + clientIp;


        Long requests = redisTemplate.opsForValue().increment(key);


        if (requests != null && requests == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }



        if (requests != null && requests > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429 Status


            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");


            String jsonResponse = "{\"error\": \"Too many requests\", \"message\": \"Rate limit exceeded. Please try again in a minute.\"}";
            response.getWriter().write(jsonResponse);

            return false;
        }

        return true;
    }
}