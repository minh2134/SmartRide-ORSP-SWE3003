package com.orsp.smartride.controller;

import java.security.Principal;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.userResponse.DriverInfoResponse;
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
import com.orsp.smartride.implementations.driver.SRDriver;

/**
 * DriverController
 */
@Controller
public class DriverController {

	@Autowired
	private ConcurrentHashMap<String, SRDriver> drivers;


	@MessageMapping("/driver/info")
	@SendToUser("/topic/driver/response")
	Response driverInfo(Principal principal) throws Exception {
		String method = "/driver/info";
		String username = principal.getName();

		SRDriver driver = drivers.get(username);
		if (driver == null) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(401, method, error);
		}
		
		DriverInfoResponse result = new DriverInfoResponse(driver.driverInfo);
		return new Response(200, method, result);
	}
	
}
