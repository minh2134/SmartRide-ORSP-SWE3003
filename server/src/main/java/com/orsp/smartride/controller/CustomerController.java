package com.orsp.smartride.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.orsp.smartride.dataStructures.Greetings;
import com.orsp.smartride.dataStructures.HelloMessage;

@RestController
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;
	// TODO: below is test code, implement the real thing later
	
	@MessageMapping("/hello")
	@SendToUser("/topic/greetings")
	public Greetings greetings(HelloMessage message) throws Exception {
		return new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
	}

	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message, @Header("simpSessionId") String sessionID) throws Exception {
		Greetings out = new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
		simpmsg.convertAndSendToUser("driver", "topic/greetings", out);
	}
}
