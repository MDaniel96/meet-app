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
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Random;

@Service
public class DistanceCalculator {

    /**
     * Calculates distance between two users in meters
     * using Google's Distance Matrix API, when travelMode: driving, walking or transit
     * using Math formulas, when travelMode is byair
     * @param fromUser logged in user
     * @param toUser other user
     * @return returns distance between two users in meters
     */
    private Integer calculateDistance(User fromUser, User toUser) throws ApiException, InterruptedException, IOException {

        Location fromLocation = fromUser.getLocation();
        Location toLocation = toUser.getLocation();

        if (fromUser.getSetting().getTravelMode().equals(Consts.TravelMode.BYAIR)) {
            return byAirDistance(fromLocation, toLocation);
        } else {
            return randomDistance(fromLocation, toLocation);
        }

        /*TravelMode travelMode = getTravelMode(fromUser);
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

        return (int) result.rows[0].elements[0].distance.inMeters;*/
    }

    /**
     * Sets distance to toUsers from fromUser
     * @param fromUser calculate distance from this user
     * @param toUsers setting their distances from fromUser
     */
    public void calculateMoreDistances(User fromUser, Collection<User> toUsers) {
        for (User user : toUsers) {
            try {
                user.setDistance(calculateDistance(fromUser, user));
            } catch (ApiException | InterruptedException | IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Returns by air distance in meters
     * source: https://www.geeksforgeeks.org/program-distance-two-points-earth/
     */
    public Integer byAirDistance(Location fromLoc, Location toLoc) {

        // From degrees to radians.
        double lon1 = Math.toRadians(fromLoc.getLon());
        double lon2 = Math.toRadians(toLoc.getLon());
        double lat1 = Math.toRadians(fromLoc.getLat());
        double lat2 = Math.toRadians(toLoc.getLat());

        // Haversine formula
        double dlon = lon2 - lon1;
        double dlat = lat2 - lat1;
        double a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlon / 2),2);

        double c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers
        double r = 6371;

        // calculate the result in meters
        return (int)(c * r * 1000);
    }

    /**
     * Returns a random distance (for testing) in meters
     */
    private Integer randomDistance(Location fromLocation, Location toLocation) {
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
