package com.orsp.smartride;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;


// TODO: currently disable DataSource in SpringBoot auto-config, research what it is
// and find out
@SpringBootApplication
public class SmartrideApplication {
	@Autowired
	private JdbcTemplate jdbc;

	public static void main(String[] args) {
		SpringApplication.run(SmartrideApplication.class, args);
	}
	
	//@Override
	//public void run() {
	//	
	//}
}
