package com.orsp.smartride.implementations.database;

import org.springframework.jdbc.core.JdbcTemplate;

import com.orsp.smartride.coreLogic.database.Database;
import com.orsp.smartride.coreLogic.ride.Ride;

public class SRDatabase extends Database {
	private SRSQLiteStatements sqlStatements;
	
	public SRDatabase(JdbcTemplate db) {
		sqlStatements = new SRSQLiteStatements();
		this.db = db;
	}

	public boolean init() {
		// Already initiated using Spring Boot Datasource hikari bean
		return true;	
	}

	public boolean updateRide(Ride ride) {
		return true;
	}
}
