package com.smartcampus.config;

import com.smartcampus.modules.auth.service.OAuth2AuthenticationSuccessHandler;
import com.smartcampus.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oauth2AuthenticationSuccessHandler = oauth2AuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/oauth2/**", "/login/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/health/**").permitAll()
                        .requestMatchers("/api/auth/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2AuthenticationSuccessHandler)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
