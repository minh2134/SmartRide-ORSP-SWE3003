package com.orsp.smartride.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.RideIDRequest;
import com.orsp.smartride.dataStructures.userResponse.DriverInfoResponse;
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
import com.orsp.smartride.dataStructures.userResponse.RideAssignmentResponse;
import com.orsp.smartride.dataStructures.userResponse.RideHistoryResponse;
import com.orsp.smartride.services.DriverService;

/**
 * DriverController
 */
@Controller
public class DriverController {

	@Autowired
	private DriverService driService;

	@MessageMapping("/driver/info")
	@SendToUser("/topic/driver/response")
	Response driverInfo(Principal principal) throws Exception {
		String method = "/driver/info";
		String username = principal.getName();

		if (!driService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		DriverInfoResponse result = new DriverInfoResponse(driService.getDriverInfo(username));
		return new Response(200, method, result);
	}
	
	// Set driver as ready
	@MessageMapping("/driver/ready")
	@SendToUser("/topic/driver/response")
	Response setDriverReady(Principal principal) throws Exception {
		String method = "/driver/ready";
		String username = principal.getName();
		
		if (!driService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		RideAssignmentResponse result = driService.setDriverReady(username);
		return new Response(200, method, result);
	}
	
	// Set driver as not ready (but maintain any active ride)
	@MessageMapping("/driver/notready")
	@SendToUser("/topic/driver/response")
	Response setDriverNotReady(Principal principal) throws Exception {
		String method = "/driver/notready";
		String username = principal.getName();
		
		if (!driService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		// Mark the driver as not ready, but don't cancel any active ride
		driService.setDriverNotReady(username);
		return new Response(200, method);
	}
	
	// Complete a ride
	@MessageMapping("/driver/completeride")
	@SendToUser("/topic/driver/response")
	Response completeRide(Principal principal, @Payload RideIDRequest request) throws Exception {
		String method = "/driver/completeride";
		String username = principal.getName();
		
		if (!driService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		// Mark the ride as complete
		boolean success = driService.completeRide(username, request.getRideID());
		
		if (success) {
			return new Response(200, method);
		} else {
			ErrorResponse error = new ErrorResponse("Failed to complete ride");
			return new Response(400, method, error);
		}
	}
	
	@MessageMapping("/driver/ridehistory")
	@SendToUser("/topic/driver/response")
	Response getRideHistory(Principal principal) throws Exception {
		String method = "/driver/ridehistory";
		String username = principal.getName();
		
		if (!driService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		RideHistoryResponse result = new RideHistoryResponse(driService.getRideHistory(username));
		return new Response(200, method, result);
	}
}
