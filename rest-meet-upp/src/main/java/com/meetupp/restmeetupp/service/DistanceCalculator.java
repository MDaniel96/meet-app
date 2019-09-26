package com.meetupp.restmeetupp.service;

import com.google.maps.DistanceMatrixApi;
import com.google.maps.DistanceMatrixApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.errors.ApiException;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.LatLng;
import com.google.maps.model.TravelMode;
import com.meetupp.restmeetupp.model.Location;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.util.Consts;
import com.meetupp.restmeetupp.util.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Random;

@Service
public class DistanceCalculator {

    /**
     * Calculates distance between two users in meters (using Google's Distance Matrix API)
     * @param fromUser logged in user
     * @param toUser other user
     * @return returns distance between two users in meters
     */
    private Integer calculateDistance(User fromUser, User toUser) throws ApiException, InterruptedException, IOException {

        Location fromLocation = fromUser.getLocation();
        Location toLocation = toUser.getLocation();
        TravelMode travelMode = getTravelMode(fromUser);

        GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(Keys.googleApiKey)
                .build();

        DistanceMatrixApiRequest request = DistanceMatrixApi.newRequest(context);
        DistanceMatrix result = request
                .origins(new LatLng(fromLocation.getLat(), fromLocation.getLon()))
                .destinations(new LatLng(toLocation.getLat(), toLocation.getLon()))
                .mode(travelMode)
                .language("en-US")
                .await();

        return (int) result.rows[0].elements[0].distance.inMeters;
    }

    /**
     * Sets distance to toUsers from fromUser
     * @param fromUser calculate distance from this user
     * @param toUsers setting their distances from fromUser
     */
    public void calculateMoreDistances(User fromUser, Collection<User> toUsers) {
        for (User user : toUsers) {
           // try {
                user.setDistance(randomDistance(fromUser, user));
           //} catch (ApiException | InterruptedException | IOException e) {
            //    e.printStackTrace();
            //}
        }
    }

    /**
     * Returns a random distance (for testing)
     */
    private Integer randomDistance(User fromUser, User toUser) {
        return new Random().nextInt(10000);
    }

    /**
     * Gets user travel mode as Google's TravelMode class
     */
    private TravelMode getTravelMode(User user) {
        switch (user.getSetting().getTravelMode()) {
            case Consts.TravelMode.DRIVING:
                return TravelMode.DRIVING;
            case Consts.TravelMode.TRANSIT:
                return TravelMode.TRANSIT;
            case Consts.TravelMode.WALKING:
                return TravelMode.WALKING;
            default:
                return TravelMode.WALKING;
        }
    }
}
