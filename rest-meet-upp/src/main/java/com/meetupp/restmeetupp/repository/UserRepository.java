package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findAll();

    User findById(Long id);

    List<User> findAllByNameContains(String keyword);

    List<User> findAllByEmailContains(String keyword);
}
