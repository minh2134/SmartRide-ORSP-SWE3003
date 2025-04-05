package com.orsp.smartride.implementations.payment;

import org.springframework.stereotype.Component;

import com.orsp.smartride.coreLogic.payment.Payment;

@Component("genericPaymentMethod")
public class GenericPaymentMethod implements Payment {
	// Mock up class to show *generally* how the system design works
	public boolean pay() {
		return true;
	}
}
