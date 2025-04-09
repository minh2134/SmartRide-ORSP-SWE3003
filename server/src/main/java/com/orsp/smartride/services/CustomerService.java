package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.RideRequest;
import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.dataStructures.UserInfo;
import com.orsp.smartride.events.ride.RideCreationEvent;
import com.orsp.smartride.implementations.customer.SRCustomer;
import com.orsp.smartride.implementations.database.SRDatabase;
import com.orsp.smartride.implementations.payment.GenericPaymentMethod;

@Service
/**
 * CustomerService
 * 
 * Component used exclusively to interact with underlying SRCustomer objects
 */
public class CustomerService {
	
	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;

	@Autowired
	private ConcurrentHashMap<String, SRCustomer> customers;

	@Autowired
	private GenericPaymentMethod genericPaymentMethod;

	@Autowired
	private SRDatabase db;
	
	public boolean exists(String username) {
		return !(customers.get(username) == null);
	}

	public UserInfo getCustomerInfo(String username) {
		SRCustomer customer = customers.get(username);
		return customer.userInfo;
	}


	public boolean genericPay(String username) {
		SRCustomer customer = customers.get(username);
		if (!customer.pay(genericPaymentMethod)) {
			return false;
		}

		return true;

	}

	public Ride makeRide(String username, RideRequest rrq) {
	
		SRCustomer customer = customers.get(username);
		RideRow rr = new RideRow(customer.getUsername(), rrq);
		int rideID = -1;
		boolean wasInARide = customer.isInARide();
		if (!wasInARide) {
			rideID = db.insertRide(rr);
			System.out.println(rideID + "<- this is the new ride ID");
		}

		Ride ride =  customer.makeRide(rrq, rideID, rr.timeStamp);
		
		// publish the event so that the RideService can handle it
		if (!wasInARide) {
			RideCreationEvent event = new RideCreationEvent(this, ride);
			applicationEventPublisher.publishEvent(event);
		}

		return ride;
	}

	public void cancelRide(String username) {
		SRCustomer customer = customers.get(username);
		customer.cancelRide();
	}

	public boolean isInARide(String username) {
		SRCustomer customer = customers.get(username);
		return customer.isInARide();
	}
	
}
