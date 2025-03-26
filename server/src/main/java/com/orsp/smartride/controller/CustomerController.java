package com.orsp.smartride.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerController {
	// TODO: below is test code, implement the real thing later
	
	@GetMapping("/customer")
	public String greeting() {
		return "Hello, World!";
	}
}
