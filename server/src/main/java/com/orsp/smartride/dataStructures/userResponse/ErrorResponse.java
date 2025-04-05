package com.orsp.smartride.dataStructures.userResponse;

public class ErrorResponse extends UserResponse {
	String content;
	
	public ErrorResponse() {}

	public ErrorResponse(String content) {
		this.content = content;
	}

	public String getContent() {
		return content;
	}
}
