package com.orsp.smartride;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;

import com.orsp.smartride.implementations.database.SRDatabase;


// TODO: currently disable DataSource in SpringBoot auto-config, research what it is
// and find out
@SpringBootApplication
public class SmartrideApplication implements CommandLineRunner {
	@Autowired
	private JdbcTemplate jdbc;
	
	private SRDatabase db; 

	public static void main(String[] args) {
		SpringApplication.run(SmartrideApplication.class, args);
	}
	
	@Override
	public void run(String... strings) throws Exception {
		this.db = new SRDatabase(jdbc);
	}
}
