package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.LocationRequest;
import com.meetupp.restmeetupp.model.Request;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.LocationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class LocationRequestService {

    @Autowired
    private LocationRequestRepository locationRequestRepository;


    public LocationRequest addRequest(User fromUser, User toUser) {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setFromUserName(fromUser.getName());
        locationRequest.setFromUserId(fromUser.getId());
        locationRequest.setTime(new Date());
        locationRequest.setToUserId(toUser.getId());

        locationRequestRepository.save(locationRequest);
        return locationRequest;
    }

    public List<LocationRequest> listAllLocationsByToUserId(Long id) {
        return locationRequestRepository.findAllByToUserId(id);
    }

    public LocationRequest findById(Long locationRequestId) {
        return locationRequestRepository.findById(locationRequestId);
    }

    public boolean isRequested(User user1, User user2) {
        return locationRequestRepository.findByFromUserIdAndToUserId(user1.getId(), user2.getId()) != null
                || locationRequestRepository.findByFromUserIdAndToUserId(user2.getId(), user1.getId()) != null;
    }

    public void removeRequest(LocationRequest locationRequest) {
        locationRequestRepository.delete(locationRequest);
    }
}
