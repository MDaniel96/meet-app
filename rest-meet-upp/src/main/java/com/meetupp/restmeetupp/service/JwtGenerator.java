package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.security.model.JwtUser;
import com.meetupp.restmeetupp.util.Consts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

@Component
public class JwtGenerator {

    private String secretKey = Consts.Jwt.SECRET_KEY;

    public String generate(JwtUser jwtUser) {

        Claims claims = Jwts.claims()
                .setSubject(jwtUser.getEmail());
        claims.put("id", String.valueOf(jwtUser.getId()));
        claims.put("password", jwtUser.getPassword());
        claims.put("role", jwtUser.getRole());

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
}

