package com.meetupp.restmeetupp.security.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class JwtUserDetails implements UserDetails {

    private Long id;
    private String email;
    private String password;
    private String token;
    private Collection<? extends GrantedAuthority> authorities;

    public JwtUserDetails(Long id, String email, String password, String token, List<GrantedAuthority> grantedAuthorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.token = token;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public String getPass() {
        return password;
    }

    public Long getId() { return id; }
}

