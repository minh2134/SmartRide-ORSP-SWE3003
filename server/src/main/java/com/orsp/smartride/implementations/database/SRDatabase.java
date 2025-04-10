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
import com.orsp.smartride.implementations.Manager;
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

	public List<Manager> getManagers() {
		return db.query(sqlStatements.getCustomers(), new RowMapper<Manager>() {
			public Manager mapRow(ResultSet rs, int rowNum) 
				throws SQLException {
				Manager manager = new Manager(
						rs.getString(1),
						rs.getString(2),
						rs.getInt(3),
						rs.getString(4),
						rs.getString(5));
				return manager;
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

	public List<RideRow> getRides() {
		return db.query(sqlStatements.getGetRides(), new RowMapper<RideRow>() {
			public RideRow mapRow(ResultSet rs, int rowNum)
				throws SQLException {
				RideRow row = new RideRow(rs.getInt(1));
				row.customer = rs.getString(2);
				row.driver = rs.getString(3);
				row.pickupLoc = rs.getString(4);
				row.dropoffLoc = rs.getString(5);
				row.vehicleType = rs.getString(6);
				row.isDone = rs.getInt(7);
				row.timeStamp = rs.getInt(8);

				return row;
			}
		});
	}
}
