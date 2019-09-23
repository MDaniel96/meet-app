package com.meetupp.restmeetupp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.maps.model.TravelMode;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Transient;

@Embeddable
public class Setting {

    private Integer radius;

    private boolean notifications;

    @Column(name = "travel_mode")
    private String travelMode;


    public Setting() {}

    public Setting(Integer radius, boolean notifications) {
        this.radius = radius;
        this.notifications = notifications;
    }

    public Integer getRadius() {
        return radius;
    }

    public void setRadius(Integer radius) {
        this.radius = radius;
    }

    public boolean isNotifications() {
        return notifications;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public String getTravelMode() { return this.travelMode; }

    public void setTravelMode(String travelMode) {
        this.travelMode = travelMode;
    }

}
