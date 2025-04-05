package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.dataStructures.UserInfo;

public class UserInfoResponse extends UserResponse {
	
	private String username;
	private String name;
	private String sex;
	private int age;
	private String phone;

	public String getUsername() {
		return username;
	}

	public String getName() {
		return name;
	}

	public String getSex() {
		return sex;
	}

	public int getAge() {
		return age;
	}

	public String getPhone() {
		return phone;
	}

	public UserInfoResponse(UserInfoResponse that) {
		this.username = that.getUsername();
		this.name = that.getName();
		this.sex = that.getSex();
		this.age = that.getAge();
		this.phone = that.getPhone();
	}

	public UserInfoResponse(UserInfo that) {
		this.username = that.getUsername();
		this.name = that.name;
		this.sex = that.sex;
		this.age = that.age;
		this.phone = that.phone;
	}
}
