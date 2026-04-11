package com.smartcampus.controller;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HealthControllerTest {

    @Test
    void getHealthStatusReturnsExpectedPayload() {
        HealthController controller = new HealthController();

        Map<String, Object> response = controller.getHealthStatus();

        assertTrue((Boolean) response.get("success"));
        assertEquals("Backend running", response.get("message"));
    }
}
