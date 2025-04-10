package com.orsp.smartride.services;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.implementations.Manager;
import com.orsp.smartride.implementations.database.SRDatabase;

@Service
/**
 * ManagerService
 */
public class ManagerService {

	@Autowired
	private SRDatabase db;

	@Autowired
	private ConcurrentHashMap<String, Manager> managers;

	public boolean exists(String username) {
		return managers.get(username) == null;
	}
	public List<RideRow> getReports() {
		return db.getRides();
	}
}
