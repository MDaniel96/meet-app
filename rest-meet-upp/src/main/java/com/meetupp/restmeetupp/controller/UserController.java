package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.service.DistanceCalculator;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
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

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Collection<User>> listAllUsers(@RequestHeader("Authorization") String token) {
        List<User> users = userService.listAllUsers();

        if (!users.isEmpty()) {
            return usersWithDistances(users, token);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/{keyword}")
    @ResponseBody
    public ResponseEntity<Collection<User>> searchUsers(@PathVariable("keyword") String keyword, @RequestHeader("Authorization") String token) {
        Set<User> users = userService.findAllByNameOrEmail(keyword);

        if (!users.isEmpty()) {
            return usersWithDistances(users, token);
        } else {
            return ResponseEntity.notFound().build();
        }    }

    @GetMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<User> getUser(@PathVariable("userId") Long userId, @RequestHeader("Authorization") String token) {
        User user = userService.findUserById(userId);

        if (user != null) {
            User fromUser = userIdentifier.identify(token);
            user.setDistance(distanceCalculator.calculateDistance(fromUser, user));
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ResponseEntity<Collection<User>> usersWithDistances(Collection<User> users, String token) {
        User fromUser = userIdentifier.identify(token);
        distanceCalculator.calculateMoreDistances(fromUser, users);
        return ResponseEntity.ok(users);
    }

}
