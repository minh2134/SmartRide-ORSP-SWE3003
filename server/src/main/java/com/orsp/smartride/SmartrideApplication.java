package com.orsp.smartride;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


// TODO: currently disable DataSource in SpringBoot auto-config, research what it is
// and find out
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class SmartrideApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartrideApplication.class, args);
	}

}
