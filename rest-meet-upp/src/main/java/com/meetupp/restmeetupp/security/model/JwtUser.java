package com.meetupp.restmeetupp.security.model;

public class JwtUser {

    private Long id;

    private String email;

    private String password;

    private String role;


    public JwtUser() {
        role = "admin";
        password = "password";
    }

    public void setId(Long id) { this.id = id; }

    public Long getId() { return id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }
}

