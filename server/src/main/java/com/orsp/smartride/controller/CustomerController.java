package com.orsp.smartride.controller;


import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.Greetings;
import com.orsp.smartride.dataStructures.HelloMessage;
import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.RideRequest;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
import com.orsp.smartride.dataStructures.userResponse.MakeRideResponse;
import com.orsp.smartride.dataStructures.userResponse.UserInfoResponse;
import com.orsp.smartride.services.CustomerService;

@Controller
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;

	@Autowired
	private CustomerService cusService;

	@MessageMapping("/customer/info")
	@SendToUser("/topic/customer/response")
	Response userInfo(Principal principal) throws Exception {
		String method = "/customer/info";
		String username = principal.getName();
		
		if (!cusService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		UserInfo customerInfo = cusService.getCustomerInfo(username);
		
		
		UserInfoResponse result = new UserInfoResponse(customerInfo);
		return new Response(200, method, result);
	}

	@MessageMapping("/customer/makeride")
	@SendToUser("/topic/customer/response")
	Response makeRide(Principal principal, @Payload RideRequest rrq) throws Exception {
		String method = "/customer/makeride";
		String username = principal.getName();
		
		if (!cusService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}

		if (!cusService.genericPay(username)) {
			ErrorResponse error = new ErrorResponse("Payment failed");
			return new Response(401, method, error);
		}

		Ride ride = cusService.makeRide(username, rrq);

		MakeRideResponse result = new MakeRideResponse(ride);
		return new Response(200, method, result);
	}

	// TODO: below is test code, implement the real thing later
	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message) throws Exception {
		Greetings out = new Greetings("Hello, " + "World!" + "!");
		simpmsg.convertAndSendToUser("customer", "topic/customer/response", out);
	}
}
