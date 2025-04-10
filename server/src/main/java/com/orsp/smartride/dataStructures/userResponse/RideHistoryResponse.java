package com.orsp.smartride.dataStructures.userResponse;

import java.util.List;
import java.util.Map;

/**
 * RideHistoryResponse - Response containing ride history data
 */
public class RideHistoryResponse extends UserResponse {
    private List<Map<String, Object>> rides;
    
    public RideHistoryResponse() {
    }
    
    public RideHistoryResponse(List<Map<String, Object>> rides) {
        this.rides = rides;
    }
    
    public List<Map<String, Object>> getRides() {
        return rides;
    }
    
    public void setRides(List<Map<String, Object>> rides) {
        this.rides = rides;
    }
} 