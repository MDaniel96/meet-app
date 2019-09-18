package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.User;
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
    private Util util;

    public FriendController(UserService userService, UserIdentifier userIdentifier, Util util) {
        this.userService = userService;
        this.userIdentifier = userIdentifier;
        this.util = util;
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
        toDeleteUser.setDistance(0);
        // TODO: chech friend status and delete only when friends
        userService.deleteFriends(user, toDeleteUser);
        return ResponseEntity.ok(toDeleteUser);
    }
}
