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

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.Greetings;
import com.orsp.smartride.dataStructures.HelloMessage;
import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.RideRequest;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.dataStructures.userResponse.UserInfoResponse;
import com.orsp.smartride.implementations.customer.SRCustomer;

@Controller("cusController")
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;

	@Autowired
	private ConcurrentHashMap<String, SRCustomer> customers;
	
	
	@MessageMapping("/customer/info")
	@SendToUser("/topic/customer/response")
	Response userInfo(Principal principal) throws Exception {
		String method = "/customer/info";
		SRCustomer customer = customers.get(principal.getName());
		
		UserInfoResponse result = new UserInfoResponse(customer.userInfo);
		return new Response(200, method, result);
	}

	@MessageMapping("/customer/makeride")
	@SendToUser("/topic/customer/response")
	Response makeRide(Principal principal, @Payload RideRequest rrq) throws Exception {
		String method = "/customer/makeride";
		SRCustomer customer = customers.get(principal.getName());
		Ride ride = customer.makeRide(rrq.pickupLoc, rrq.dropoffLoc);

		return new Response(200, method);
	}

	public void rideDone() {
		System.out.println("Wait this shit actually works?");
	}

	// TODO: below is test code, implement the real thing later
	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message, @Header("simpSessionId") String sessionID) throws Exception {
		Greetings out = new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
		simpmsg.convertAndSendToUser("driver", "topic/greetings", out);
	}
}
