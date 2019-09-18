package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {

    List<FriendRequest> findAllByToUserId(Long toUserId);

    FriendRequest findById(Long id);

    FriendRequest findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

}
