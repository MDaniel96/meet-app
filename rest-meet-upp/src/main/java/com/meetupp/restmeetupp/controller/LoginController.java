package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.security.JwtGenerator;
import com.meetupp.restmeetupp.security.model.JwtUser;
import com.meetupp.restmeetupp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private JwtGenerator jwtGenerator;
    private UserService userService;

    public LoginController(JwtGenerator jwtGenerator, UserService userService) {
        this.jwtGenerator = jwtGenerator;
        this.userService = userService;
    }

    @PostMapping("/test/{email}")
    @ResponseBody
    public ResponseEntity<String> testLogin(@PathVariable("email") String email) {
        User user = userService.findByEmail(email);

        if (user != null) {
            return generateResponseToken(user, email);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private ResponseEntity<String> generateResponseToken(User user, String email) {
        JwtUser jwtUser = new JwtUser();
        jwtUser.setId(user.getId());
        jwtUser.setEmail(email);
        return ResponseEntity.ok(jwtGenerator.generate(jwtUser));
    }

}
