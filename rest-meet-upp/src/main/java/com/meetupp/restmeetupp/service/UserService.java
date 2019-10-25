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

    /**
     * Create new location permission between two users
     */
    public void addLocationPermission(User u1, User u2) {
        Locations locations = new Locations();
        locations.setFromUserId(u1.getId());
        locations.setToUserId(u2.getId());
        locations.setTime(new Date());
        locationsRepository.save(locations);
    }

    /**
     * Returns true if two users are friends
     */
    public boolean isFriends(User u1, User u2) {
        return u1.getFriends().contains(u2) || u1.getUsers().contains(u2);
    }

    /**
     * Returns true if the users have location permission to each other (can see each others location)
     */
    public boolean hasLocationPermission(User u1, User u2) {
        return locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId()) != null
                || locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId()) != null;
    }

    /**
     * Return location permission of two users
     */
    public Locations getLocations(User u1, User u2) {
        Locations locations1 = locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId());
        Locations locations2 = locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId());

        if (locations1 != null) {
            return locations1;
        } else {
            return locations2;
        }
    }

    /**
     * Deletes location permission of two users
     */
    public void deleteLocations(User u1, User u2) {
        Locations locations = locationsRepository.findByFromUserIdAndToUserId(u1.getId(), u2.getId());
        Locations locations2 = locationsRepository.findByFromUserIdAndToUserId(u2.getId(), u1.getId());

        if (locations != null) {
            locationsRepository.delete(locations);
        } else if (locations2 != null) {
            locationsRepository.delete(locations2);
        }
    }

    public void deleteAllLocationPermission(List<Locations> locations) {
        locationsRepository.deleteAll(locations);
    }

    /**
     * Returns all location permissions of user
     */
    public List<Locations> getLocations(User user) {
        return locationsRepository.findAllByFromUserIdOrToUserId(user.getId(), user.getId());
    }

    private void setSettingsDefaults(User user) {
        user.setSetting(new Setting(Consts.UserDefaults.RADIUS, Consts.UserDefaults.NOTIFICATIONS,
                Consts.UserDefaults.TRAVEL_MODE, Consts.UserDefaults.NIGHT_MODE, Consts.UserDefaults.CALENDAR));
    }
}
