package com.online_clipboard_backend.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(auth -> auth
                        .requestMatchers(("/admin/**")).hasRole("ADMIN")
                        .requestMatchers("/**").permitAll())
                .formLogin(Customizer.withDefaults());

        return httpSecurity.build();

    }

    @Bean
    public UserDetailsService userDetailsService() {

        UserDetails user1 = User.withUsername("admin").password(passwordEncoder.encode("pass")).roles("ADMIN").build();

        return new InMemoryUserDetailsManager(user1);

    }


}
