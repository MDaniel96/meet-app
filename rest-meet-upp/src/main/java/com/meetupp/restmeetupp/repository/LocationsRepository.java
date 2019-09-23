package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.Locations;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationsRepository extends JpaRepository<Locations, Integer> {

    Locations findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

    List<Locations> findAllByFromUserIdOrToUserId(Long fromUserId, Long toUserId);

}
