package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.User;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Random;

@Service
public class DistanceCalculator {

    public Integer calculateDistance(User fromUser, User toUser) {
        return new Random().nextInt(10000);
    }

    public void calculateMoreDistances(User fromUser, Collection<User> toUsers) {
        for (User user : toUsers) {
            user.setDistance(calculateDistance(fromUser, user));
        }
    }
}
