package com.orsp.smartride.implementations.customer;

import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.dataStructures.UserInfo;

public class SRCustomer extends Customer {
	
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
}
