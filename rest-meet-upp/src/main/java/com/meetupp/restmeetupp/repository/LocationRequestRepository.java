package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.LocationRequest;
import com.meetupp.restmeetupp.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRequestRepository extends JpaRepository<LocationRequest, Integer> {

    List<LocationRequest> findAllByToUserId(Long toUserId);

    LocationRequest findById(Long id);

    LocationRequest findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

}
