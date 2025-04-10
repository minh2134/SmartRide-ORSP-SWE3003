package com.orsp.smartride.dataStructures.userResponse;

import java.util.List;

import com.orsp.smartride.dataStructures.RideRow;

/**
 * RideList
 */
public class RideList extends UserResponse {

	private List<RideRow> rides;

	public RideList() {}

	public RideList(List<RideRow> rides) {
		this.rides = rides;
	}

	public List<RideRow> getRides() {
		return rides;
	}


}
