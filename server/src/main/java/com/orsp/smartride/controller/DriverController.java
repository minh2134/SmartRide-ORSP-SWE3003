package com.orsp.smartride.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.userResponse.DriverInfoResponse;
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
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
	
}
