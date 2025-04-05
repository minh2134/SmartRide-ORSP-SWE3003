package com.orsp.smartride;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

import com.orsp.smartride.coreLogic.driver.Driver;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.implementations.customer.SRCustomer;
import com.orsp.smartride.implementations.database.SRDatabase;


@SpringBootApplication
public class SmartrideApplication implements CommandLineRunner {
	@Autowired
	private JdbcTemplate jdbc;

	private SRDatabase db;
	
	private ConcurrentHashMap<String, Driver> drivers;

	public static void main(String[] args) {
		SpringApplication.run(SmartrideApplication.class, args);
	}
	
	@Override
	public void run(String... strings) throws Exception {
		// Initialize the db
		this.db = new SRDatabase(jdbc);

		// Creating customer objects, assigning it to a map
		List<UserInfo> cusInfo = db.getCustomers();

		for (int i=0; i<cusInfo.size(); i++) {
			SRCustomer customer = new SRCustomer(cusInfo.get(i));
			customers().put(customer.getUsername(), customer);
		}

	}

	@Bean
	ConcurrentHashMap<String, SRCustomer> customers() {
		return new ConcurrentHashMap<String, SRCustomer>();
	}
}
