package com.smartcampus.modules.auth.dto;

public record LocalRegisterRequest(
        String firstName,
        String lastName,
        String email,
        String universityId,
        String password
) {
}
