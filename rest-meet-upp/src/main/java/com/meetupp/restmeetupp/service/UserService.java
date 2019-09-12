package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public List<User> listAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Set<User> findAllByNameOrEmail(String keyword) {
        Set<User> result = new HashSet<>();

        result.addAll(userRepository.findAllByNameContains(keyword));
        result.addAll(userRepository.findAllByEmailContains(keyword));

        return result;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
