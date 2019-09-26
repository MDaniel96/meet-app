package com.meetupp.restmeetupp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String name;

    private String image;

    @Embedded
    private Location location;

    @Embedded
    private Setting setting;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "friends",
        joinColumns = @JoinColumn(name = "user1Id"),
        inverseJoinColumns = @JoinColumn(name = "user2Id"))
    private Set<User> users;

    @JsonIgnore
    @ManyToMany(mappedBy = "users")
    private Set<User> friends;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Location getLocation() { return this.location; }

    public void setLocation(Location location) { this.location = location; }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public Setting getSetting() { return this.setting; }

    public void setSetting(Setting setting) { this.setting = setting; }

    public Set<User> getUsers() { return users; }

    public void setUsers(Set<User> users) { this.users = users; }

    public Set<User> getFriends() { return friends; }

    public void setFriends(Set<User> friends) { this.friends = friends; }

    @Transient
    private Integer distance;

    @JsonIgnore
    public Set<User> getAllFriends() {
        this.friends.addAll(this.users);
        return this.friends;
    }

}
