package com.meetupp.restmeetupp;

import com.meetupp.restmeetupp.controller.LoginController;
import com.meetupp.restmeetupp.controller.UserController;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import static org.assertj.core.api.Java6Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApplicationTest {

    private String BASE_URL;

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserController userController;

    @Autowired
    private LoginController loginController;

    private static final String NOT_EXISTING_EMAIL = "notexisting@email.hu";
    private static final String EXISTING_EMAIL = "email@email.hu";

    @Before
    public void setUp() {
        BASE_URL = "http://localhost:" + port;
    }

    @Test
    public void contextLoads() {
        assertThat(userController).isNotNull();
    }

    @Test
    public void testLogin_existingEmail() {
        ResponseEntity<String> response = restTemplate
                .getForEntity(BASE_URL + "/login/test/" + EXISTING_EMAIL, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("token");
    }

    @Test
    public void testLogin_notExistingEmail() {
        ResponseEntity<String> response = restTemplate
                .getForEntity(BASE_URL + "/login/test/" + NOT_EXISTING_EMAIL, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

}
