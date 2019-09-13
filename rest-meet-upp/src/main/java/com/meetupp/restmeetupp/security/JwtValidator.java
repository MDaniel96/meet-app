package com.meetupp.restmeetupp.security;

import com.meetupp.restmeetupp.security.model.JwtUser;
import com.meetupp.restmeetupp.util.Consts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;


@Component
public class JwtValidator {

    private String secret = Consts.Jwt.SECRET_KEY;

    public JwtUser validate(String token) {

        JwtUser jwtUser = null;
        try {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            jwtUser = new JwtUser();

            jwtUser.setEmail(body.getSubject());
            jwtUser.setId(Long.parseLong((String) body.get("id")));
            jwtUser.setPassword((String) body.get("password"));
            jwtUser.setRole((String) body.get("role"));
        }
        catch (Exception e) {
            System.out.println(e);
        }

        return jwtUser;
    }
}

