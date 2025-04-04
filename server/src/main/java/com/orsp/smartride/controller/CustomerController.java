package com.orsp.smartride.controller;


import java.security.Principal;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.orsp.smartride.dataStructures.Greetings;
import com.orsp.smartride.dataStructures.HelloMessage;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.implementations.customer.SRCustomer;

@Controller
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;

	@Autowired
	private ConcurrentHashMap<String, SRCustomer> customers;
	
	
	@MessageMapping("/customer/info")
	@SendToUser("/topic/info")
	UserInfo userInfo(Principal principal) throws Exception {
		SRCustomer customer = customers.get(principal.getName());
		System.out.println(customer.userInfo.name);
		return customer.userInfo;
	}

	// TODO: below is test code, implement the real thing later
	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message, @Header("simpSessionId") String sessionID) throws Exception {
		Greetings out = new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
		simpmsg.convertAndSendToUser("driver", "topic/greetings", out);
	}
}
