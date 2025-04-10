package com.orsp.smartride.implementations.database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.orsp.smartride.coreLogic.database.Database;
import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.implementations.driver.DriverInfo;

@Component
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

	public List<DriverInfo> getDrivers() {
		return db.query(sqlStatements.getDrivers(), new RowMapper<DriverInfo>() {
			public DriverInfo mapRow(ResultSet rs, int rowNum) 
				throws SQLException {
				DriverInfo userInfo = new DriverInfo(rs.getString(1), rs.getString(6)); // username and license
				userInfo.name = rs.getString(2);
				userInfo.age = rs.getInt(3);
				userInfo.sex = rs.getString(4);
				userInfo.phone = rs.getString(5);
				return userInfo;
			}
		});
	}
	
	public int insertRide(RideRow rr) {
		// return rideID
		
		db.update(sqlStatements.getInsertRide(), rr.customer, rr.driver, rr.pickupLoc, rr.dropoffLoc, rr.vehicleType, rr.timeStamp);

		List<Integer> result = db.query(sqlStatements.getLastInsertRowID(), new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum)
				throws SQLException {
				return rs.getInt(1);
			}
		});
		
		return result.get(0);
	}
}
