package com.smartcampus.modules.auth.controller;

import com.smartcampus.modules.auth.repository.RoleRepository;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.auth.service.AuthCookieService;
import com.smartcampus.modules.auth.service.LocalAuthService;
import com.smartcampus.modules.auth.service.UserService;
import com.smartcampus.security.JwtService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthCookieService authCookieService;

    @MockBean
    private LocalAuthService localAuthService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserService userService;

    @MockBean
    private RoleRepository roleRepository;

    @Test
    void meWithoutAuthReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Unauthorized"));
    }

    @Test
    void logoutClearsCookie() throws Exception {
        ResponseCookie authCookie = ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie sessionCookie = ResponseCookie.from("JSESSIONID", "")
            .httpOnly(true)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();

        when(authCookieService.clearAuthCookie()).thenReturn(authCookie);
        when(authCookieService.clearSessionCookie()).thenReturn(sessionCookie);

        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
            .andExpect(header().stringValues(HttpHeaders.SET_COOKIE, Matchers.hasItem(Matchers.containsString("auth_token="))))
            .andExpect(header().stringValues(HttpHeaders.SET_COOKIE, Matchers.hasItem(Matchers.containsString("JSESSIONID="))))
            .andExpect(header().stringValues(HttpHeaders.SET_COOKIE, Matchers.hasItem(Matchers.containsString("Max-Age=0"))));
    }
}
