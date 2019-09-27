package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.FriendRequest;
import com.meetupp.restmeetupp.model.Locations;
import com.meetupp.restmeetupp.model.RequestStatus;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.FriendRequestService;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
import com.meetupp.restmeetupp.util.Consts;
import com.meetupp.restmeetupp.util.Util;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(Consts.EndpointBase.FRIENDS)
public class FriendController {

    private UserService userService;
    private UserIdentifier userIdentifier;

    private FriendRequestService friendRequestService;

    private Util util;

    public FriendController(UserService userService, UserIdentifier userIdentifier, Util util, FriendRequestService friendRequestService) {
        this.userService = userService;
        this.userIdentifier = userIdentifier;
        this.util = util;
        this.friendRequestService = friendRequestService;
    }

    /**
     * Returns all friends of user, sorted by their distance from him
     * @param token gets user info from token
     * @return all friends of user
     */
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<User>> listAllFriends(@RequestHeader("Authorization") String token) {
        User fromUser = userIdentifier.identify(token);
        Set<User> friends = fromUser.getAllFriends();

        if (!friends.isEmpty()) {
            List<User> users = util.usersWithDistances(new ArrayList<>(friends), fromUser);
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes friendship between two users
     * @param userId user to be deleted
     * @param token logged in user
     * @return deleted user
     */
    @DeleteMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<User> deleteUsersFriend(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        User toDeleteUser = userService.findUserById(userId);

        if (userService.isFriends(user, toDeleteUser)) {
            toDeleteUser.setDistance(0);
            userService.deleteFriends(user, toDeleteUser);
            return ResponseEntity.ok(toDeleteUser);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Adding friend request from logged in user to user with userId
     * @param userId to user
     * @param token logged in user
     * @return added request
     */
    @PostMapping("/request/{userId}")
    @ResponseBody
    public ResponseEntity<FriendRequest> addFriendRequest(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User fromUser = userIdentifier.identify(token);
        User toUser = userService.findUserById(userId);

        if (toUser != null && !userId.equals(fromUser.getId())) {
            FriendRequest request = friendRequestService.addRequest(fromUser, toUser);
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lists all friend requests of user
     * @param token logged in user
     * @return all friend requests of user
     */
    @GetMapping("/request/all")
    @ResponseBody
    public ResponseEntity<List<FriendRequest>> listAllFriendRequests(@RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        List<FriendRequest> friendRequests = friendRequestService.listAllByToUserId(user.getId());

        if (!friendRequests.isEmpty()) {
            return ResponseEntity.ok(friendRequests);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Accepts a friend request
     * @param friendRequestId request to be accepted
     * @return User
     */
    @PostMapping("/request/accept/{friendRequestId}")
    @ResponseBody
    public ResponseEntity<String> acceptFriendRequest(@PathVariable("friendRequestId") Long friendRequestId) {
        FriendRequest friendRequest = friendRequestService.findById(friendRequestId);

        if (friendRequest != null) {
            User fromUser = userService.findUserById(friendRequest.getFromUserId());
            User toUser = userService.findUserById(friendRequest.getToUserId());

            userService.addFriends(fromUser, toUser);
            friendRequestService.removeRequest(friendRequest);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a friend request
     * @param friendRequestId request to be deleted
     * @return ok
     */
    @DeleteMapping("/request/cancel/{friendRequestId}")
    @ResponseBody
    public ResponseEntity<String> cancelFriendRequest(@PathVariable("friendRequestId") Long friendRequestId) {
        FriendRequest friendRequest = friendRequestService.findById(friendRequestId);

        if (friendRequest != null) {
            friendRequestService.removeRequest(friendRequest);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Gets friendship status
     * @param userId other user
     * @param token logged in user
     * @return
     *      ACCEPTED: they are friends
     *      NOT_ACCEPTED: they are not friends
     *      ON_THE_WAY: a request was sent to either user
     */
    @GetMapping("/{userId}/status")
    @ResponseBody
    public ResponseEntity<RequestStatus> getFriendshipStatus(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User user1 = userIdentifier.identify(token);
        User user2 = userService.findUserById(userId);

        if (user2 == null) {
            return ResponseEntity.notFound().build();
        }

        if (userService.isFriends(user1, user2)) {
            return ResponseEntity.ok(RequestStatus.ACCEPTED);
        } else if (friendRequestService.isRequested(user1, user2)) {
            return ResponseEntity.ok(RequestStatus.ON_THE_WAY);
        } else {
            return ResponseEntity.ok(RequestStatus.NOT_ACCEPTED);
        }
    }

    /**
     * - gets user's friends
     * - calculates their distances
     * - deletes user's timed out location permissions
     * - gets friends who are within radius and have no location permission with user
     * @param token identifies user
     * @return friends who are within radius and have no location permission with user
     */
    @GetMapping("/notify")
    @ResponseBody
    public ResponseEntity<List<User>> getNotifications(@RequestHeader("Authorization") String token) {
        User fromUser = userIdentifier.identify(token);
        Set<User> friends = fromUser.getAllFriends();

        if (!friends.isEmpty()) {
            List<User> friendsWithDistance = util.usersWithDistances(new ArrayList<>(friends), fromUser);
            refreshLocationPermissions(fromUser);
            List<User> notificationFriends = getNotificationFriends(fromUser, friendsWithDistance);
            return ResponseEntity.ok(notificationFriends);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes expired location permissions of user
     * @param fromUser user
     */
    private void refreshLocationPermissions(User fromUser) {
        List<Locations> locationsToDelete = new ArrayList<>();
        List<Locations> userLocationPermissions = userService.getLocations(fromUser);
        for (Locations locationPermission : userLocationPermissions) {
            if (util.isDateExpired(locationPermission.getTime())) {
                locationsToDelete.add(locationPermission);
            }
        }
        userService.deleteAllLocationPermission(locationsToDelete);
    }

    /**
     * Returns friends who are within radius and user has location permission to them
     * @param fromUser user
     * @param friendsWithDistance user's friends
     * @return friends who are within radius and user has no location permission to them
     */
    private List<User> getNotificationFriends(User fromUser, List<User> friendsWithDistance) {
        List<User> notificationFriends = new ArrayList<>();
        for (User friend : friendsWithDistance) {
            // todo: ez itt szar
            if (friend.getDistance() <= fromUser.getDistance()
                    && !userService.hasLocationPermission(fromUser, friend)) {
                notificationFriends.add(friend);
            }
        }
        return notificationFriends;
    }
}
