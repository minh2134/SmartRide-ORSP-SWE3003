package com.orsp.smartride.implementations.database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.orsp.smartride.database.Database;
import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.implementations.driver.DriverInfo;

@Component
public class SRDatabase implements Database {
	private SRSQLiteStatements sqlStatements;
	private JdbcTemplate db;
	
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
				userInfo.setName(rs.getString(2));
				userInfo.setAge(rs.getInt(3));
				userInfo.setSex(rs.getString(4));
				userInfo.setPhoneNumber(rs.getString(5));
				return userInfo;
			}
		});
	}
	
	public int insertRide(RideRow rr) {
		// return rideID
		try {
			db.update(sqlStatements.getInsertRide(), rr.customer, rr.driver, rr.pickupLoc, rr.dropoffLoc, rr.vehicleType, rr.timeStamp);

			List<Integer> result = db.query(sqlStatements.getLastInsertRowID(), new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum)
					throws SQLException {
					return rs.getInt(1);
				}
			});
			
			return result.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
	@Override
	public boolean markRideComplete(int rideID) {
		try {
			// Execute SQL update to mark ride as complete (isDone=1)
			int rowsAffected = db.update("UPDATE rides SET isDone = 1 WHERE rideID = ?", rideID);
			return rowsAffected > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	@Override
	public List<Map<String, Object>> getRideHistory(String username) {
		// By default, get customer history (for backward compatibility)
		return getRideHistoryForCustomer(username);
	}
	
	@Override
	public List<Map<String, Object>> getRideHistoryForCustomer(String username) {
		try {
			// Select all rides where the user is the customer
			return db.query(
				"SELECT rideID, customer, driver, pickupLoc, dropoffLoc, isDone, timeStamp, vehicleType, fare FROM rides WHERE customer = ? ORDER BY timeStamp DESC",
				new RowMapper<Map<String, Object>>() {
					public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
						Map<String, Object> rideMap = new HashMap<>();
						rideMap.put("rideID", rs.getInt("rideID"));
						rideMap.put("customer", rs.getString("customer"));
						rideMap.put("driver", rs.getString("driver"));
						rideMap.put("pickupLoc", rs.getString("pickupLoc"));
						rideMap.put("dropoffLoc", rs.getString("dropoffLoc"));
						rideMap.put("isDone", rs.getInt("isDone"));
						rideMap.put("timeStamp", rs.getLong("timeStamp"));
						rideMap.put("vehicleType", rs.getString("vehicleType"));
						rideMap.put("fare", rs.getFloat("fare"));
						return rideMap;
					}
				},
				username
			);
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}
	
	@Override
	public List<Map<String, Object>> getRideHistoryForDriver(String username) {
		try {
			// Select all rides where the user is the driver
			return db.query(
				"SELECT rideID, customer, driver, pickupLoc, dropoffLoc, isDone, timeStamp, vehicleType, fare FROM rides WHERE driver = ? ORDER BY timeStamp DESC",
				new RowMapper<Map<String, Object>>() {
					public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
						Map<String, Object> rideMap = new HashMap<>();
						rideMap.put("rideID", rs.getInt("rideID"));
						rideMap.put("customer", rs.getString("customer"));
						rideMap.put("driver", rs.getString("driver"));
						rideMap.put("pickupLoc", rs.getString("pickupLoc"));
						rideMap.put("dropoffLoc", rs.getString("dropoffLoc"));
						rideMap.put("isDone", rs.getInt("isDone"));
						rideMap.put("timeStamp", rs.getLong("timeStamp"));
						rideMap.put("vehicleType", rs.getString("vehicleType"));
						rideMap.put("fare", rs.getFloat("fare"));
						return rideMap;
					}
				},
				username
			);
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}
	
	/**
	 * Get active ride for a user (customer or driver)
	 * @param username The username
	 * @param isDriver Whether the user is a driver
	 * @return Map containing ride details or null if no active ride
	 */
	public Map<String, Object> getActiveRideForUser(String username, boolean isDriver) {
		try {
			String query;
			if (isDriver) {
				query = "SELECT rideID, customer, driver, pickupLoc, dropoffLoc, isDone, timeStamp, vehicleType, fare " +
						"FROM rides WHERE driver = ? AND isDone = 0 ORDER BY timeStamp DESC LIMIT 1";
			} else {
				query = "SELECT rideID, customer, driver, pickupLoc, dropoffLoc, isDone, timeStamp, vehicleType, fare " +
						"FROM rides WHERE customer = ? AND isDone = 0 ORDER BY timeStamp DESC LIMIT 1";
			}
			
			List<Map<String, Object>> results = db.query(
				query,
				new RowMapper<Map<String, Object>>() {
					public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
						Map<String, Object> rideMap = new HashMap<>();
						rideMap.put("rideID", rs.getInt("rideID"));
						rideMap.put("customer", rs.getString("customer"));
						rideMap.put("driver", rs.getString("driver"));
						rideMap.put("pickupLoc", rs.getString("pickupLoc"));
						rideMap.put("dropoffLoc", rs.getString("dropoffLoc"));
						rideMap.put("isDone", rs.getInt("isDone"));
						rideMap.put("timeStamp", rs.getLong("timeStamp"));
						rideMap.put("vehicleType", rs.getString("vehicleType"));
						rideMap.put("fare", rs.getFloat("fare"));
						return rideMap;
					}
				},
				username
			);
			
			return results.isEmpty() ? null : results.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
