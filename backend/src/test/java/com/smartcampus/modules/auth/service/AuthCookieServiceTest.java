package com.smartcampus.modules.auth.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthCookieServiceTest {

    @Test
    void createAuthCookieSetsExpectedAttributes() {
        AuthCookieService service = new AuthCookieService(false, "Lax", 3600);

        ResponseCookie cookie = service.createAuthCookie("sample-token");

        assertEquals("auth_token", cookie.getName());
        assertTrue(cookie.isHttpOnly());
        assertEquals(Duration.ofSeconds(3600), cookie.getMaxAge());
        assertEquals("Lax", cookie.getSameSite());
        assertEquals("/", cookie.getPath());
    }

    @Test
    void clearAuthCookieSetsExpectedAttributes() {
        AuthCookieService service = new AuthCookieService(true, "Strict", 7200);

        ResponseCookie cookie = service.clearAuthCookie();

        assertEquals("auth_token", cookie.getName());
        assertTrue(cookie.isHttpOnly());
        assertEquals(Duration.ZERO, cookie.getMaxAge());
        assertEquals("Strict", cookie.getSameSite());
        assertEquals("/", cookie.getPath());
    }
}
