package com.orsp.smartride.dataStructures;

public class UnidirectionalMessage {
	String method;
	Object content;

	public UnidirectionalMessage() {}

	public UnidirectionalMessage(String method, Object object) {
		this.method = method;
		this.content = object; 
	}

	public String getMethod() {
		return method;
	}

	public Object getContent() {
		return content;
	}
}
