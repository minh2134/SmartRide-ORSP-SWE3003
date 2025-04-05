package com.orsp.smartride.implementations.customer;

import org.springframework.beans.factory.annotation.Autowired;

import com.orsp.smartride.controller.CustomerController;
import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.dataStructures.UserInfo;

public class SRCustomer extends Customer {
	
	@Autowired
	private CustomerController cusController;
	
	public UserInfo userInfo;

	public SRCustomer(String username) {
		this.userInfo = new UserInfo(username);
	}

	public SRCustomer(UserInfo userInfo) {
		this.userInfo = new UserInfo(userInfo);
	}

	public String getUsername() {
		return userInfo.getUsername();
	}

	public UserInfo getUserInfo() {
		return userInfo;
	}

	@Override
	public void markRideDone(){
		ride = null; // delete reference to said ride
		cusController.rideDone();
		
	}
}
