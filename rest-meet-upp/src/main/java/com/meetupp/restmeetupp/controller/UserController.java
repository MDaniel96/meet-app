package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.service.DistanceCalculator;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private DistanceCalculator distanceCalculator;

    public UserController(UserService userService, DistanceCalculator distanceCalculator) {
        this.userService = userService;
        this.distanceCalculator = distanceCalculator;
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = userService.listAllUsers();

        if (!users.isEmpty()) {
            distanceCalculator.calculateMoreDistances(null, users);
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @GetMapping("/search/{keyword}")
    @ResponseBody
    public ResponseEntity<Set<User>> searchUsers(@PathVariable("keyword") String keyword) {
        Set<User> users = userService.findAllByNameOrEmail(keyword);

        if (!users.isEmpty()) {
            distanceCalculator.calculateMoreDistances(null, users);
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<User> getUser(@PathVariable("userId") Long userId) {
        User user = userService.findUserById(userId);

        if (user != null) {
            user.setDistance(distanceCalculator.calculateDistance(null, user));
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
