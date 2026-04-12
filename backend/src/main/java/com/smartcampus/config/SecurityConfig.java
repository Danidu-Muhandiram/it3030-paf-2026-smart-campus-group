package com.smartcampus.config;

import com.smartcampus.modules.auth.service.OAuth2AuthenticationSuccessHandler;
import com.smartcampus.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}")
    private String allowedMethods;

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
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                // Required for cookie auth between localhost:5173 and localhost:8080.
                    config.setAllowCredentials(true);
                    config.setAllowedOrigins(splitCsv(allowedOrigins));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowedMethods(splitCsv(allowedMethods));
                    return config;
                }))
            // OAuth handshake still uses a temporary server session.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                // Public endpoints needed before authentication is established.
                        .requestMatchers("/oauth2/**", "/login/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/health/**").permitAll()
                        .requestMatchers("/api/auth/public/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2AuthenticationSuccessHandler)
                )
            // Populate SecurityContext from auth_token cookie on API requests.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private List<String> splitCsv(String value) {
        // Supports comma-separated values from env variables.
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(entry -> !entry.isEmpty())
                .toList();
    }
}
