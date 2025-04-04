package com.orsp.smartride.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class RestfulController {
	@GetMapping("/rest/fare")
	public String getFarePerKm() {
		return "{'fare': 2000.00}";
	}
		
}
