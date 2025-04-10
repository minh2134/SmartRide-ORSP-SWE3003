package com.orsp.smartride.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.orsp.smartride.dataStructures.Response;
import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.dataStructures.userResponse.ErrorResponse;
import com.orsp.smartride.dataStructures.userResponse.RideList;
import com.orsp.smartride.services.ManagerService;

@Controller
/**
 * ManagerController
 */
public class ManagerController {

	@Autowired
	private ManagerService manService;

	@MessageMapping("/manager/report")
	@SendToUser("/topic/manager/response")
	Response sendReports(Principal principal) {
		String method = "/manager/report";
		String username = principal.getName();

		if (!manService.exists(username)) {
			ErrorResponse error = new ErrorResponse("Unauthorized");
			return new Response(400, method, error);
		}
		
		List<RideRow> rides = manService.getReports();
		RideList result = new RideList(rides);

		return new Response(200, method, result);
	}
}
