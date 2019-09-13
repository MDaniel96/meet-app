package com.meetupp.restmeetupp.service;

import org.json.JSONObject;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;
import org.springframework.social.facebook.api.impl.FacebookTemplate;
import org.springframework.stereotype.Service;

@Service
public class FacebookService {

    /**
     * Creates a models.User object from the given fb access-token,
     * returns null if token is incorrect
     */
    public com.meetupp.restmeetupp.model.User getUser(String accessToken) {
        Facebook facebook = new FacebookTemplate(accessToken);
        String[] fields = {"id", "name", "email", "picture{url}"};

        com.meetupp.restmeetupp.model.User user = new com.meetupp.restmeetupp.model.User();
        try {
            User facebookUser = facebook.fetchObject("me", User.class, fields);
            user.setName(facebookUser.getName());
            user.setEmail(facebookUser.getEmail());
            user.setDistance(0);

            String str = facebook.fetchObject("me", String.class, fields);
            JSONObject jsonObject = new JSONObject(str);
            user.setImage(jsonObject.getJSONObject("picture").getJSONObject("data").getString("url"));
        } catch (Exception e) {
            return null;
        }

        return user;
    }

}
