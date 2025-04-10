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

<<<<<<< Updated upstream
	public boolean updateRide(Ride ride) {
		return true;
=======
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
		String sql = "INSERT INTO rides (customer, driver, pickupLoc, dropoffLoc, vehicleType, timeStamp, fare, isDone) VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
		
		try {
			db.update(sql, rr.customer, rr.driver, rr.pickupLoc, rr.dropoffLoc, rr.vehicleType, rr.timeStamp, rr.fare);
			
			List<Integer> result = db.query(sqlStatements.getLastInsertRowID(), new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum)
					throws SQLException {
					return rs.getInt(1);
				}
			});
			
			int rideId = result.get(0);
			System.out.println("Inserted ride with ID: " + rideId);
			return rideId;
		} catch (Exception e) {
			System.err.println("Error inserting ride: " + e.getMessage());
			e.printStackTrace();
			return -1;
		}
	}

	public Ride getNextPendingRide() {
		// Get the oldest pending ride
		String sql = "SELECT * FROM rides WHERE driver IS NULL AND isDone = 0 ORDER BY timeStamp ASC LIMIT 1";
		
		try {
			List<RideRow> pendingRides = db.query(sql, new RowMapper<RideRow>() {
				public RideRow mapRow(ResultSet rs, int rowNum) throws SQLException {
					RideRow row = new RideRow(rs.getInt("rideID"));
					row.customer = rs.getString("customer");
					row.driver = rs.getString("driver");
					row.pickupLoc = rs.getString("pickupLoc");
					row.dropoffLoc = rs.getString("dropoffLoc");
					row.vehicleType = rs.getString("vehicleType");
					row.isDone = rs.getInt("isDone");
					row.timeStamp = rs.getLong("timeStamp");
					row.fare = rs.getFloat("fare");
					return row;
				}
			});
			
			if (pendingRides.isEmpty()) {
				System.out.println("No pending rides found");
				return null;
			}
			
			RideRow pendingRide = pendingRides.get(0);
			System.out.println("Found pending ride: " + pendingRide.rideID);
			
			// TODO: Convert RideRow to Ride object
			// For now, just return null as the calling code expects
			return null;
		} catch (Exception e) {
			System.err.println("Error getting pending ride: " + e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	public boolean updateRideDriver(int rideID, String driverUsername) {
		String sql = "UPDATE rides SET driver = ? WHERE rideID = ?";
		
		try {
			System.out.println("Assigning driver " + driverUsername + " to ride " + rideID);
			db.update(sql, driverUsername, rideID);
			return true;
		} catch (Exception e) {
			System.err.println("Error updating ride driver: " + e.getMessage());
			e.printStackTrace();
			return false;
		}
	}

	public boolean markRideComplete(int rideID) {
		String sql = "UPDATE rides SET isDone = 1 WHERE rideID = ?";
		
		try {
			System.out.println("Marking ride " + rideID + " as complete");
			db.update(sql, rideID);
			return true;
		} catch (Exception e) {
			System.err.println("Error marking ride complete: " + e.getMessage());
			return false;
		}
	}
	
	public List<RideRow> getRideHistoryForCustomer(String username) {
		String sql = "SELECT * FROM rides WHERE customer = ? ORDER BY timeStamp DESC";
		
		try {
			List<RideRow> rides = db.query(sql, new RowMapper<RideRow>() {
				public RideRow mapRow(ResultSet rs, int rowNum) throws SQLException {
					RideRow row = new RideRow(rs.getInt("rideID"));
					row.customer = rs.getString("customer");
					row.driver = rs.getString("driver");
					row.pickupLoc = rs.getString("pickupLoc");
					row.dropoffLoc = rs.getString("dropoffLoc");
					row.vehicleType = rs.getString("vehicleType");
					row.isDone = rs.getInt("isDone");
					row.timeStamp = rs.getLong("timeStamp");
					row.fare = rs.getFloat("fare");
					return row;
				}
			}, username);
			
			System.out.println("Retrieved " + rides.size() + " rides for customer: " + username);
			return rides;
		} catch (Exception e) {
			System.err.println("Error fetching ride history for customer: " + e.getMessage());
			e.printStackTrace();
			return new ArrayList<>();
		}
	}
	
	public List<RideRow> getRideHistoryForDriver(String username) {
		String sql = "SELECT * FROM rides WHERE driver = ? ORDER BY timeStamp DESC";
		
		try {
			List<RideRow> rides = db.query(sql, new RowMapper<RideRow>() {
				public RideRow mapRow(ResultSet rs, int rowNum) throws SQLException {
					RideRow row = new RideRow(rs.getInt("rideID"));
					row.customer = rs.getString("customer");
					row.driver = rs.getString("driver");
					row.pickupLoc = rs.getString("pickupLoc");
					row.dropoffLoc = rs.getString("dropoffLoc");
					row.vehicleType = rs.getString("vehicleType");
					row.isDone = rs.getInt("isDone");
					row.timeStamp = rs.getLong("timeStamp");
					row.fare = rs.getFloat("fare");
					return row;
				}
			}, username);
			
			System.out.println("Retrieved " + rides.size() + " rides for driver: " + username);
			return rides;
		} catch (Exception e) {
			System.err.println("Error fetching ride history for driver: " + e.getMessage());
			e.printStackTrace();
			return new ArrayList<>();
		}
>>>>>>> Stashed changes
	}
}
