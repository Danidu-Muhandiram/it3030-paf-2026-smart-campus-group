package com.smartcampus.modules.auth.dto;

public record LocalLoginRequest(
        String email,
        String password
) {
}
