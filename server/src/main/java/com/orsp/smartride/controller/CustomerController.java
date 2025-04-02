package com.orsp.smartride.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.orsp.smartride.dataStructures.Greetings;
import com.orsp.smartride.dataStructures.HelloMessage;

@RestController
public class CustomerController {
	// TODO: below is test code, implement the real thing later
	
	@GetMapping("/customer/auth")
	public String greeting() {
		return "Hello, World!";
	}

	@MessageMapping("/hello")
	@SendTo("/topic/greetings")
	public Greetings greetings(HelloMessage message) throws Exception {
		Thread.sleep(1000);
		return new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
	}
}
