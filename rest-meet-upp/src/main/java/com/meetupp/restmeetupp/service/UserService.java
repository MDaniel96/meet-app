package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.Locations;
import com.meetupp.restmeetupp.model.Setting;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.LocationsRepository;
import com.meetupp.restmeetupp.repository.UserRepository;
import com.meetupp.restmeetupp.util.Consts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationsRepository locationsRepository;


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

    public void deleteFriends(User u1, User u2) {
        u1.getFriends().remove(u2);
        u1.getUsers().remove(u2);

        u2.getFriends().remove(u1);
        u2.getUsers().remove(u1);

        userRepository.save(u1);
        userRepository.save(u2);
    }

    public void addFriends(User u1, User u2) {
        u1.getFriends().add(u2);
        u2.getUsers().add(u1);
        userRepository.save(u1);
        userRepository.save(u2);
    }

    public void addLocations(User u1, User u2) {
        Locations locations = new Locations();
        locations.setFromUserId(u1.getId());
        locations.setToUserId(u2.getId());
        locations.setTime(new Date());
        locationsRepository.save(locations);
    }

    public boolean isFriends(User u1, User u2) {
        return u1.getFriends().contains(u2) || u1.getUsers().contains(u2);
    }

    public boolean isLocations(User u1, User u2) {
        return locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId()) != null
                || locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId()) != null;
    }

    public Locations getLocations(User u1, User u2) {
        Locations locations1 = locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId());
        Locations locations2 = locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId());

        if (locations1 != null) {
            return locations1;
        } else {
            return locations2;
        }
    }

    public void deleteLocations(User u1, User u2) {
        Locations locations = locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId());
        Locations locations2 = locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId());

        if (locations != null) {
            locationsRepository.delete(locations);
        } else if (locations2 != null) {
            locationsRepository.delete(locations2);
        }
    }

    private void setSettingsDefaults(User user) {
        user.setSetting(new Setting(Consts.User.RADIUS, Consts.User.NOTIFICATIONS));
    }
}
