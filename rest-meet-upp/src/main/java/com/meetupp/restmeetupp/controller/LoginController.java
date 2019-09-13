package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.service.FacebookService;
import com.meetupp.restmeetupp.service.JwtGenerator;
import com.meetupp.restmeetupp.security.model.JwtUser;
import com.meetupp.restmeetupp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private JwtGenerator jwtGenerator;
    private UserService userService;
    private FacebookService facebookService;

    public LoginController(JwtGenerator jwtGenerator, UserService userService, FacebookService facebookService) {
        this.jwtGenerator = jwtGenerator;
        this.userService = userService;
        this.facebookService = facebookService;
    }

    /**
     * Test login, without facebook
     * @param email identifies user who logs in
     * @return Authorization token
     */
    @PostMapping("/test/{email}")
    @ResponseBody
    public ResponseEntity<String> testLogin(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        if (user != null) {
            return ResponseEntity.ok(generateResponseToken(user, email));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Facebook login
     * @param accessToken facebook's token from which user infos are extracted
     * @return Authorization token
     */
    @PostMapping("/facebook/{accessToken}")
    @ResponseBody
    public ResponseEntity<String> facebookLogin(@PathVariable("accessToken") String accessToken) {
        User facebookUser = facebookService.getUser(accessToken);
        if (facebookUser == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.findByEmail(facebookUser.getEmail());
        if (user != null) {
            return ResponseEntity.ok(generateResponseToken(user, facebookUser.getEmail()));
        } else {
            userService.registerUser(facebookUser);
            return ResponseEntity.ok(generateResponseToken(facebookUser, facebookUser.getEmail()));
        }
    }

    private String generateResponseToken(User user, String email) {
        JwtUser jwtUser = new JwtUser();
        jwtUser.setId(user.getId());
        jwtUser.setEmail(email);
        return jwtGenerator.generate(jwtUser);
    }

}
