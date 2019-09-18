package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.Location;
import com.meetupp.restmeetupp.model.Setting;
import com.meetupp.restmeetupp.service.DistanceCalculator;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
import com.meetupp.restmeetupp.util.Consts;
import com.meetupp.restmeetupp.util.Util;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(Consts.EndpointBase.USER)
public class UserController {

    private UserService userService;
    private DistanceCalculator distanceCalculator;
    private UserIdentifier userIdentifier;
    private Util util;

    public UserController(UserService userService, DistanceCalculator distanceCalculator, UserIdentifier userIdentifier, Util util) {
        this.userService = userService;
        this.distanceCalculator = distanceCalculator;
        this.userIdentifier = userIdentifier;
        this.util = util;
    }

    /**
     * Listing all users
     * @return all users
     */
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<User>> listAllUsers(@RequestHeader("Authorization") String token) {
        List<User> users = userService.listAllUsers();
        User fromUser = userIdentifier.identify(token);

        if (!users.isEmpty()) {
            return ResponseEntity.ok(util.usersWithDistances(users, fromUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Search for users
     * @param keyword word to look for in user's name or email
     * @return found users
     */
    @GetMapping("/search/{keyword}")
    @ResponseBody
    public ResponseEntity<List<User>> searchUsers(@PathVariable("keyword") String keyword, @RequestHeader("Authorization") String token) {
        User fromUser = userIdentifier.identify(token);
        Set<User> users = userService.findAllByNameOrEmail(keyword);

        if (!users.isEmpty()) {
            return ResponseEntity.ok(util.usersWithDistances(new ArrayList<>(users), fromUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Search for user
     * @param userId id of user to search for
     * @return found user
     */
    @GetMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<User> getUserById(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User user = userService.findUserById(userId);

        if (user != null) {
            User fromUser = userIdentifier.identify(token);
            user.setDistance(distanceCalculator.calculateDistance(fromUser, user));
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns current logged in user
     * @param token gets user info from token
     * @return current user
     */
    @GetMapping("/current")
    @ResponseBody
    public ResponseEntity<User> getUserByToken(@RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        user.setDistance(0);
        return ResponseEntity.ok(user);
    }

    /**
     * Updates a user's location
     * @param location Body object for which to update
     * @param token gets user info from token
     * @return updated user
     */
    @PutMapping("/location")
    @ResponseBody
    public ResponseEntity<User> updateUserLocation(@RequestBody Location location, @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        user.setDistance(0);
        location.setTime(new Date());
        user.setLocation(location);
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }

    /**
     * Updates a user's settings
     * @param setting Body object for which to update
     * @param token gets user info from token
     * @return updated user
     */
    @PutMapping("/settings")
    @ResponseBody
    public ResponseEntity<User> updateUserSetting(@RequestBody Setting setting, @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        user.setDistance(0);
        user.setSetting(setting);
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }

}
