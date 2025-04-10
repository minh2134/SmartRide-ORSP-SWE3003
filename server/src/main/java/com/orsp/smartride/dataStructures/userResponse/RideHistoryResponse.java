package com.orsp.smartride.dataStructures.userResponse;

import java.util.List;
import java.util.ArrayList;
import com.orsp.smartride.dataStructures.RideRow;

public class RideHistoryResponse extends UserResponse {
    private List<RideRow> rides;
    
    public RideHistoryResponse() {
        this.rides = new ArrayList<>();
    }
    
    public RideHistoryResponse(List<RideRow> rides) {
        this.rides = rides;
    }
    
    public List<RideRow> getRides() {
        return rides;
    }
    
    public void setRides(List<RideRow> rides) {
        this.rides = rides;
    }
} 