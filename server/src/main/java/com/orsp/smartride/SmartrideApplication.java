package com.orsp.smartride;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.implementations.Manager;
import com.orsp.smartride.implementations.customer.SRCustomer;
import com.orsp.smartride.implementations.database.SRDatabase;
import com.orsp.smartride.implementations.driver.DriverInfo;
import com.orsp.smartride.implementations.driver.SRDriver;


@SpringBootApplication
public class SmartrideApplication implements CommandLineRunner {

	@Autowired
	private SRDatabase db;
	
	public static void main(String[] args) {
		SpringApplication.run(SmartrideApplication.class, args);
	}
	
	@Override
	public void run(String... strings) throws Exception {

		// Creating customer objects, assigning it to a map
		List<UserInfo> cusInfo = db.getCustomers();

		for (int i=0; i<cusInfo.size(); i++) {
			SRCustomer customer = new SRCustomer(cusInfo.get(i));
			customers().put(customer.getUsername(), customer);
		}

		// Creating driver objects, assigning it to a map
		List<DriverInfo> driInfo = db.getDrivers();

		for (int i=0; i<driInfo.size(); i++) {
			SRDriver driver = new SRDriver(driInfo.get(i));
			drivers().put(driver.getUsername(), driver);
		}

		// Creating manager objects, assigning it to a map
		List<Manager> managerObjects = db.getManagers();

		for (int i=0; i<managerObjects.size(); i++) {
			Manager manager = managerObjects.get(i);
			managers().put(manager.getUsername(), manager);
		}

		

	}

	@Bean
	ConcurrentHashMap<String, SRCustomer> customers() {
		return new ConcurrentHashMap<String, SRCustomer>();
	}

	@Bean
	ConcurrentHashMap<String, SRDriver> drivers() {
		return new ConcurrentHashMap<String, SRDriver>();
	}

	@Bean
	ConcurrentHashMap<String, Manager> managers() {
		return new ConcurrentHashMap<String, Manager>();
	}

	@Bean
	ConcurrentHashMap<Integer, Ride> rides() {
		return new ConcurrentHashMap<Integer, Ride>();
	}
}
