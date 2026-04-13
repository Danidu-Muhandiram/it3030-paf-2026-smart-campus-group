package com.smartcampus.modules.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieService {

    // Single place for auth cookie policy to keep login/logout behavior consistent.

    private final boolean secure;
    private final String sameSite;
    private final long sessionMaxAgeSeconds;

    public AuthCookieService(
            @Value("${app.auth.cookie.secure:false}") boolean secure,
            @Value("${app.auth.cookie.same-site:Lax}") String sameSite,
            @Value("${app.auth.session.max-age-seconds:86400}") long sessionMaxAgeSeconds
    ) {
        this.secure = secure;
        this.sameSite = sameSite;
        this.sessionMaxAgeSeconds = sessionMaxAgeSeconds;
    }

    public ResponseCookie createAuthCookie(String token) {
        // HttpOnly prevents token access from browser JavaScript.
        return ResponseCookie.from("auth_token", token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
            .maxAge(sessionMaxAgeSeconds)
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie clearAuthCookie() {
        // Same cookie attributes + Max-Age=0 instruct browser to delete it.
        return ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie clearSessionCookie() {
        return ResponseCookie.from("JSESSIONID", "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}
