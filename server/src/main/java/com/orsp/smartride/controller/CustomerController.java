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
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
import com.orsp.smartride.dataStructures.userResponse.MakeRideResponse;
import com.orsp.smartride.dataStructures.userResponse.UserInfoResponse;
import com.orsp.smartride.implementations.customer.SRCustomer;
import com.orsp.smartride.implementations.payment.GenericPaymentMethod;

@Controller
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;

	@Autowired
	private ConcurrentHashMap<String, SRCustomer> customers;

	@Autowired
	private GenericPaymentMethod genericPaymentMethod;
	
	
	@MessageMapping("/customer/info")
	@SendToUser("/topic/customer/response")
	Response userInfo(Principal principal) throws Exception {
		String method = "/customer/info";
		String username = principal.getName();

		SRCustomer customer = customers.get(username);
		if (customer == null) {
			ErrorResponse error = new ErrorResponse("Wrong credentials");
			return new Response(401, method, error);
		}
		
		UserInfoResponse result = new UserInfoResponse(customer.userInfo);
		return new Response(200, method, result);
	}

	@MessageMapping("/customer/makeride")
	@SendToUser("/topic/customer/response")
	Response makeRide(Principal principal, @Payload RideRequest rrq) throws Exception {
		String method = "/customer/makeride";
		String username = principal.getName();
		
		SRCustomer customer = customers.get(username);
		if (customer == null) {
			ErrorResponse error = new ErrorResponse("Wrong credentials");
			return new Response(401, method, error);
		}

		if (!customer.pay(genericPaymentMethod)) {
			return new Response(401, method, new ErrorResponse("Payment failed"));
		}

		Ride ride = customer.makeRide(rrq.pickupLoc, rrq.dropoffLoc);
		
		MakeRideResponse result = new MakeRideResponse(ride);
		return new Response(200, method, result);
	}

	// TODO: below is test code, implement the real thing later
	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message) throws Exception {
		Greetings out = new Greetings("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
		simpmsg.convertAndSendToUser("driver", "topic/greetings", out);
	}
}
