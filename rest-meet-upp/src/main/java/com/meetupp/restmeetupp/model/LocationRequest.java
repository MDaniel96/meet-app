package com.meetupp.restmeetupp.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="location_request")
public class LocationRequest extends Request {
    private String message;

    public void setMessage(String message) { this.message = message; }

    public String getMessage() { return this.message; }
}
