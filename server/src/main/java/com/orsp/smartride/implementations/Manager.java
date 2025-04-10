package com.orsp.smartride.implementations;

/**
 * Manager
 */
public class Manager {

	private String username;
	private String name;
	private int age;
	private String sex;
	private String phone;

	public Manager(
			String username, 
			String name, 
			int age, 
			String sex, 
			String phone) {
		this.username = username;
		this.name = name;
		this.age = age;
		this.sex = sex;
		this.phone = phone;
	}

	public String getUsername() {
		return username;
	}

	public String getName() {
		return name;
	}

	public int getAge() {
		return age;
	}

	public String getSex() {
		return sex;
	}

	public String getPhone() {
		return phone;
	}
}
