package com.smartcampus.backend;

import com.smartcampus.SmartCampusApplication;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BackendApplicationTests {

	@Test
	void applicationClassIsPresent() {
		assertEquals("SmartCampusApplication", SmartCampusApplication.class.getSimpleName());
	}

}
