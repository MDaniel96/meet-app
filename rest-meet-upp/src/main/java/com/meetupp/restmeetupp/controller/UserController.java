package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.service.DistanceCalculator;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private DistanceCalculator distanceCalculator;
    private UserIdentifier userIdentifier;

    public UserController(UserService userService, DistanceCalculator distanceCalculator, UserIdentifier userIdentifier) {
        this.userService = userService;
        this.distanceCalculator = distanceCalculator;
        this.userIdentifier = userIdentifier;
    }

    /**
     * Listing all users
     * @return all users
     */
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Collection<User>> listAllUsers(@RequestHeader("Authorization") String token) {
        List<User> users = userService.listAllUsers();

        if (!users.isEmpty()) {
            return ResponseEntity.ok(usersWithDistances(users, token));
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
    public ResponseEntity<Collection<User>> searchUsers(@PathVariable("keyword") String keyword, @RequestHeader("Authorization") String token) {
        Set<User> users = userService.findAllByNameOrEmail(keyword);

        if (!users.isEmpty()) {
            return ResponseEntity.ok(usersWithDistances(users, token));
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


    private Collection<User> usersWithDistances(Collection<User> users, String token) {
        User fromUser = userIdentifier.identify(token);
        distanceCalculator.calculateMoreDistances(fromUser, users);
        return users;
    }

}
