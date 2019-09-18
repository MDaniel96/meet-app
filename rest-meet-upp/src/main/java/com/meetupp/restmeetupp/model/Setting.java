package com.meetupp.restmeetupp.model;

import javax.persistence.Embeddable;

@Embeddable
public class Setting {

    private Integer radius;

    private boolean notifications;

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

}
