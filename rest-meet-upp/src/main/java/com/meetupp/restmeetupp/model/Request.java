package com.meetupp.restmeetupp.model;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="from_user_name")
    private String fromUserName;

    @Column(name="from_user_id")
    private Long fromUserId;

    private Date time;

    @Column(name="to_user_id")
    private Long toUserId;


    public Request() {}

    public Request(String fromUserName, Long fromUserId, Date time, Long toUserId) {
        this.fromUserName = fromUserName;
        this.fromUserId = fromUserId;
        this.time = time;
        this.toUserId = toUserId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFromUserName() {
        return fromUserName;
    }

    public void setFromUserName(String fromUserName) {
        this.fromUserName = fromUserName;
    }

    public Long getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(Long fromUserId) {
        this.fromUserId = fromUserId;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Long getToUserId() {
        return toUserId;
    }

    public void setToUserId(Long toUserId) {
        this.toUserId = toUserId;
    }
}
