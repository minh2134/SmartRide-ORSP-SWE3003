package com.orsp.smartride.dataStructures;

public class UserInfo {
	public String name;
	public String sex;
	public int age;

	public UserInfo() {
		name = "";
		sex = "";
		age = 0;
	}

	public UserInfo(String name, String sex, int age) {
		this.name = name;
		this.sex = sex;
		this.age = age;
	}

	// Deep copy method
	public UserInfo(UserInfo target) {
		this(target.name, target.sex, target.age);
	}
}
