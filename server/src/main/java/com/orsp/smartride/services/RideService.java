package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.events.ride.RideCreationEvent;

@Service
/**
 * RideService
 */
public class RideService implements ApplicationListener<RideCreationEvent> {

	@Autowired
	ConcurrentHashMap<Integer, Ride> rides;

	@Override
	public void onApplicationEvent(RideCreationEvent event) {
		Ride ride = event.getRide();
		int rideID = ride.getRideID();
		System.out.println("A ride just created, ID: " + rideID);

		rides.put(rideID, ride);

		return;
	}
}
