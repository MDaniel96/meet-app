package com.meetupp.restmeetupp.util;

import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.DistanceCalculator;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class Util {

    private DistanceCalculator distanceCalculator;

    public Util() {
        distanceCalculator = new DistanceCalculator();
    }

    /**
     * Calculates all users' distances from a specific user, sorted by distance
     * @param users all users, whose distance to be calculated
     * @param fromUser specific user
     * @return all users around fromUser
     */
    public List<User> usersWithDistances(List<User> users, User fromUser) {
        distanceCalculator.calculateMoreDistances(fromUser, users);
        users.sort(Comparator.comparingLong(User::getDistance));
        return users;
    }

}
