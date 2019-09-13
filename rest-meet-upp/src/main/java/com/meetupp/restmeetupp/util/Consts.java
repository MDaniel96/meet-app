package com.meetupp.restmeetupp.util;

public class Consts {
    private Consts() {}


    public static class User {
        private User() {}

        public static final boolean NOTIFICATIONS = true;
        public static final Integer RADIUS = 5000;
    }

    public static class Jwt {
        private Jwt() {}

        public static final String SECRET_KEY = "morvai";
        public static final String AUTH_ROUTE_PATTERN = "/user/**";
    }

}
