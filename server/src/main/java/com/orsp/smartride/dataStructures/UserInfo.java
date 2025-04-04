package com.orsp.smartride.dataStructures;

public class UserInfo {
	private String username;
	public String name;
	public String sex;
	public int age;
	public String phone;

	public UserInfo(String username) {
		this.username = username;
		name = "";
		sex = "";
		age = 0;
	}

	public UserInfo(String username, String name, String sex, int age, String phone) {
		this.username = username;
		this.name = name;
		this.sex = sex;
		this.age = age;
		this.phone = phone;
	}

	public String getUsername() {
		return username;
	}

	// Deep copy method
	public UserInfo(UserInfo target) {
		this(target.username, target.name, target.sex, target.age, target.phone);
	}

	// clone method
	public UserInfo clone() {
		return new UserInfo(this);
	}
}
