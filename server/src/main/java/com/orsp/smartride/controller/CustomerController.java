package com.orsp.smartride.controller;


import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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
import com.orsp.smartride.events.ride.RideCreationEvent;
import com.orsp.smartride.implementations.driver.SRDriver;
import com.orsp.smartride.services.CustomerService;
import com.orsp.smartride.services.DriverService;

@Controller
public class CustomerController {
	
	// define a Spring simple messager, autowire it to then use it for websocket
	// communication
	@Autowired
	private SimpMessagingTemplate simpmsg;

	@Autowired
	private CustomerService cusService;

	@Autowired
	private DriverService driService;

	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;

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

		boolean wasInARide = cusService.isInARide(username);

		Ride ride = cusService.makeRide(username, rrq);


		// publish the event so that the RideService can handle it
		if (!wasInARide) {
			SRDriver driver = driService.assignDriver(ride);
			if (driver != null) {
				RideCreationEvent event = new RideCreationEvent(this, ride);
				applicationEventPublisher.publishEvent(event);
			} 
			else {
				ErrorResponse error = new ErrorResponse("No driver found");
				return new Response(404, method, error);
			}
				
		}

		MakeRideResponse result = new MakeRideResponse(ride);
		return new Response(200, method, result);
	}

	@MessageMapping("/customer/cancelride")
	@SendToUser("/topic/customer/response")
	Response cancelRide(Principal principal) throws Exception {
		String method = "/customer/cancelride";
		String username = principal.getName();

		if (!cusService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		if (cusService.isInARide(username)) {
			cusService.cancelRide(username);
			return new Response(200, method);
		}
		else {
			ErrorResponse error = new ErrorResponse("Not in a ride");
			return new Response(400, method, error);
		}

	}

	// TODO: below is test code, implement the real thing later
	@MessageMapping("/spechello")
	public void specGreetings(@Payload HelloMessage message) throws Exception {
		Greetings out = new Greetings("Hello, " + "World!" + "!");
		simpmsg.convertAndSendToUser("customer", "topic/customer/response", out);
	}
}
