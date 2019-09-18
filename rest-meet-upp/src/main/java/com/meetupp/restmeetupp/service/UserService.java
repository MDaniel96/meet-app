package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.Setting;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.UserRepository;
import com.meetupp.restmeetupp.util.Consts;
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

    public void registerUser(User user) {
        setSettingsDefaults(user);
        userRepository.save(user);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    private void setSettingsDefaults(User user) {
        user.setSetting(new Setting(Consts.User.RADIUS, Consts.User.NOTIFICATIONS));
    }

    public void deleteFriends(User u1, User u2) {
        u1.getFriends().remove(u2);
        u1.getUsers().remove(u2);

        u2.getFriends().remove(u1);
        u2.getUsers().remove(u1);

        userRepository.save(u1);
        userRepository.save(u2);
    }

}
