package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.FriendRequest;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.FriendRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    public FriendRequest addRequest(User fromUser, User toUser) {
        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setFromUserId(fromUser.getId());
        friendRequest.setFromUserName(fromUser.getName());
        friendRequest.setFromUserImage(fromUser.getImage());
        friendRequest.setTime(new Date());
        friendRequest.setToUserId(toUser.getId());

        friendRequestRepository.save(friendRequest);
        return friendRequest;
    }

    public List<FriendRequest> listAllByToUserId(Long toUserId) {
        return friendRequestRepository.findAllByToUserId(toUserId);
    }

    public FriendRequest findById(Long id) {
        return friendRequestRepository.findById(id);
    }

    public void removeRequest(FriendRequest friendRequest) {
        friendRequestRepository.delete(friendRequest);
    }

    public boolean isRequested(User user1, User user2) {
        return friendRequestRepository.findByFromUserIdAndToUserId(user1.getId(), user2.getId()) != null
                || friendRequestRepository.findByFromUserIdAndToUserId(user2.getId(), user1.getId()) != null;
    }
}
