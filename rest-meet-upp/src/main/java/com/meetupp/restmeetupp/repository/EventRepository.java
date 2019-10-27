package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Integer> {

    Event findById(Long id);

    List<Event> findAllByNameContainsIgnoreCase(String keyword);

}
