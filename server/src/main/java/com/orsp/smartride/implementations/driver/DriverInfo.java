package com.orsp.smartride.implementations.driver;

/**
 * DriverInfo - Contains driver information
 */
public class DriverInfo {
	private String username;
	private String license;
	private String name;
	private int age;
	private String sex;
	private String phoneNumber;
	
	public DriverInfo() {
		// Default constructor
		this.username = "";
		this.license = "";
		this.name = "";
		this.age = 0;
		this.sex = "";
		this.phoneNumber = "";
	}
	
	public DriverInfo(String username, String license) {
		this.username = username;
		this.license = license;
		this.name = "";
		this.age = 0;
		this.sex = "";
		this.phoneNumber = "";
	}
	
	public DriverInfo(DriverInfo other) {
		this.username = other.username;
		this.license = other.license;
		this.name = other.name;
		this.age = other.age;
		this.sex = other.sex;
		this.phoneNumber = other.phoneNumber;
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getLicense() {
		return license;
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
	
	public String getPhoneNumber() {
		return phoneNumber;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setLicense(String license) {
		this.license = license;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setAge(int age) {
		this.age = age;
	}
	
	public void setSex(String sex) {
		this.sex = sex;
	}
	
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
}
