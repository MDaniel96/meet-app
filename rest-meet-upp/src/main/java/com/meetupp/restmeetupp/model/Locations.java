package com.meetupp.restmeetupp.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "locations")
public class Locations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user1Id")
    private Long fromUserId;

    @Column(name = "user2Id")
    private Long toUserId;

    private Date time;

    public Locations(Long fromUserId, Long toUserId, Date time) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.time = time;
    }

    public Locations() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(Long fromUserId) {
        this.fromUserId = fromUserId;
    }

    public Long getToUserId() {
        return toUserId;
    }

    public void setToUserId(Long toUserId) {
        this.toUserId = toUserId;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
