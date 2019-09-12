package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.UserRepository;
import com.meetupp.restmeetupp.security.JwtValidator;
import org.springframework.stereotype.Component;

@Component
public class UserIdentifier {

    private UserRepository userRepository;
    private JwtValidator jwtValidator = new JwtValidator();

    public UserIdentifier(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User identify(String token) {
        Long id = jwtValidator.validate(token.substring(7)).getId();
        return userRepository.findById(id);
    }
}


