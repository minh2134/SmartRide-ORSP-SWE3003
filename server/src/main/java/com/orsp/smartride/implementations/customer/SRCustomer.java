package com.orsp.smartride.implementations.customer;

import org.springframework.web.bind.annotation.RestController;

import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.dataStructures.UserInfo;

public class SRCustomer extends Customer {
	
	private String username;
	public UserInfo userInfo;

	public SRCustomer(String username) {
		this.username = username;
		this.userInfo = new UserInfo();
	}

	public SRCustomer(String username, UserInfo userInfo) {
		this.username = username;
		this.userInfo = new UserInfo(userInfo);
	}

	String getUsername() {
		return username;
	}
}
