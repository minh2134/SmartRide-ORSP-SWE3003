package com.orsp.smartride.implementations.database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.orsp.smartride.coreLogic.database.Database;
import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.UserInfo;

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

	public List<UserInfo> getCustomers() {
		return db.query(sqlStatements.getCustomers(), new RowMapper<UserInfo>() {
			public UserInfo mapRow(ResultSet rs, int rowNum) 
				throws SQLException {
				UserInfo userInfo = new UserInfo(rs.getString(1));
				userInfo.name = rs.getString(2);
				userInfo.age = rs.getInt(3);
				userInfo.sex = rs.getString(4);
				userInfo.phone = rs.getString(5);
				return userInfo;
			}
		});
	}

	public boolean updateRide(Ride ride) {
		return true;
	}
}
