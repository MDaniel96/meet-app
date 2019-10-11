package com.meetupp.restmeetupp.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Setting {

    private Integer radius;

    private boolean notifications;

    @Column(name = "travel_mode")
    private String travelMode;

    @Column(name = "night_mode")
    private boolean nightMode;

    public Setting() {}

    public Setting(Integer radius, boolean notifications, String travelMode, boolean nightMode) {
        this.radius = radius;
        this.notifications = notifications;
        this.travelMode = travelMode;
        this.nightMode = nightMode;
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

    public boolean isNightMode() {
        return nightMode;
    }

    public void setNightMode(boolean nightMode) {
        this.nightMode = nightMode;
    }

}
