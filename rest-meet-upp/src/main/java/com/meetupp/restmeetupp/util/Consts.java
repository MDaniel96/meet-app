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

    public static class EndpointBase {
        private EndpointBase() {}

        public static final String LOGIN = "/login";
        public static final String USER = "/user";
        public static final String FRIENDS = USER + "/friend";
        public static final String LOCATIONS = USER + "/location";
    }

    public static class Timing {
        private Timing() {}

        public static final int LOCATION_PERMISSION_VALID_SEC = 15;
    }

}
