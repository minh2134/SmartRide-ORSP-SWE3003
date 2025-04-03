package com.orsp.smartride.coreLogic.database;

import org.springframework.jdbc.core.JdbcTemplate;

import com.orsp.smartride.coreLogic.ride.Ride;

abstract public class Database {
	protected String type;
	protected JdbcTemplate db;

	abstract public boolean init();
	abstract public boolean updateRide(Ride ride);
}
