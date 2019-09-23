package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.LocationRequest;
import com.meetupp.restmeetupp.model.Locations;
import com.meetupp.restmeetupp.model.RequestStatus;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.LocationRequestService;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
import com.meetupp.restmeetupp.util.Consts;
import com.meetupp.restmeetupp.util.Util;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Consts.EndpointBase.LOCATIONS)
public class LocationController {

    private UserService userService;
    private UserIdentifier userIdentifier;
    private Util util;

    private LocationRequestService locationRequestService;

    public LocationController(UserService userService, UserIdentifier userIdentifier, LocationRequestService locationRequestService, Util util) {
        this.userIdentifier = userIdentifier;
        this.userService = userService;
        this.locationRequestService = locationRequestService;
        this.util = util;
    }

    /**
     * Adding location request from logged in user to user with userId
     * @param userId to user
     * @param token logged in user
     * @return added request
     */
    @PostMapping("/request/{userId}/{message}")
    @ResponseBody
    public ResponseEntity<LocationRequest> addLocationRequest(@PathVariable("userId") Long userId, @PathVariable("message") String message, @RequestHeader("Authorization") String token) {
        User fromUser = userIdentifier.identify(token);
        User toUser = userService.findUserById(userId);

        if (toUser != null && !userId.equals(fromUser.getId())) {
            LocationRequest locationRequest = new LocationRequest();
            locationRequest.setMessage(message);
            LocationRequest request = locationRequestService.addRequest(fromUser, toUser);
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lists all location requests of user
     * @param token logged in user
     * @return all location requests of user
     */
    @GetMapping("/request/all")
    @ResponseBody
    public ResponseEntity<List<LocationRequest>> listAllLocationRequests(@RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        List<LocationRequest> locationRequests = locationRequestService.listAllLocationsByToUserId(user.getId());

        if (!locationRequests.isEmpty()) {
            return ResponseEntity.ok(locationRequests);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Accepts a location request
     * @param locationRequestId request to be accepted
     * @return ok
     */
    @PostMapping("/request/accept/{locationRequestId}")
    @ResponseBody
    public ResponseEntity<String> acceptLocationRequest(@PathVariable("locationRequestId") Long locationRequestId) {
        LocationRequest locationRequest = locationRequestService.findById(locationRequestId);

        if (locationRequest != null) {
            User fromUser = userService.findUserById(locationRequest.getFromUserId());
            User toUser = userService.findUserById(locationRequest.getToUserId());

            userService.addLocationPermission(fromUser, toUser);
            locationRequestService.removeRequest(locationRequest);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a location request
     * @param locationRequestId request to be deleted
     * @return ok
     */
    @DeleteMapping("/request/cancel/{locationRequestId}")
    @ResponseBody
    public ResponseEntity<String> cancelLocationRequest(@PathVariable("locationRequestId") Long locationRequestId) {
        LocationRequest locationRequest = locationRequestService.findById(locationRequestId);

        if (locationRequest != null) {
            locationRequestService.removeRequest(locationRequest);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes location sharing between two users
     * @param userId user to be deleted
     * @param token logged in user
     * @return deleted user
     */
    @DeleteMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<User> deleteUsersLocation(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User toDeleteUser = userService.findUserById(userId);
        User user = userIdentifier.identify(token);

        if (userService.hasLocationPermission(user, toDeleteUser)) {
            toDeleteUser.setDistance(0);
            userService.deleteLocations(user, toDeleteUser);
            return ResponseEntity.ok(toDeleteUser);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gets location status
     * @param userId other user
     * @param token logged in user
     * @return
     *      ACCEPTED: locations are shared
     *      NOT_ACCEPTED: locations are not shared
     *      ON_THE_WAY: a request was sent to either user
     */
    @GetMapping("/{userId}/status")
    @ResponseBody
    public ResponseEntity<RequestStatus> getLocationsStatus(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User toUser = userService.findUserById(userId);
        User fromUser = userIdentifier.identify(token);

        if (toUser == null) {
            return ResponseEntity.notFound().build();
        }

        if (userService.hasLocationPermission(fromUser, toUser)) {
            Locations locations = userService.getLocations(fromUser, toUser);
            if (util.isDateExpired(locations.getTime())) {
                userService.deleteLocations(fromUser, toUser);
                return ResponseEntity.ok(RequestStatus.EXPIRED);
            } else {
                return ResponseEntity.ok(RequestStatus.ACCEPTED);
            }
        } else if (locationRequestService.isRequested(fromUser, toUser)) {
            return ResponseEntity.ok(RequestStatus.ON_THE_WAY);
        } else {
            return ResponseEntity.ok(RequestStatus.NOT_ACCEPTED);
        }
    }

}
