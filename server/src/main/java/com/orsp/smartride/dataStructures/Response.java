package com.orsp.smartride.dataStructures;

import com.orsp.smartride.dataStructures.userResponse.UserResponse;

public class Response {
	int status;
	String method;
	UserResponse result;
	
	public Response() {}

	public Response(int status, String method) {
		this.status = status;
		this.method = method;
	}

	public Response(int status, String method, UserResponse result) {
		this.status = status;
		this.method = method;
		this.result = result;
	}

	public int getStatus() {
		return status;
	}

	public String getMethod() {
		return method;
	}

	public UserResponse getResult() {
		return result;
	}
}
