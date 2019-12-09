package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.Locations;
import com.meetupp.restmeetupp.model.Setting;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.LocationsRepository;
import com.meetupp.restmeetupp.repository.UserRepository;
import com.meetupp.restmeetupp.util.Consts;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationsRepository locationsRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void listAllUsers_callsFindAll() {
        userService.listAllUsers();

        verify(userRepository).findAll();
    }

    @Test
    public void setSettingsDefaults_correctConsts() {
        User user = new User();
        userService.setSettingsDefaults(user);

        Setting resultSetting = user.getSetting();
        assertThat(resultSetting.getRadius())
                .isEqualTo(Consts.UserDefaults.RADIUS);
        assertThat(resultSetting.getTravelMode())
                .isEqualTo(Consts.UserDefaults.TRAVEL_MODE);
        assertThat(resultSetting.isCalendar())
                .isEqualTo(Consts.UserDefaults.CALENDAR);
    }

    @Test
    public void getLocations_returnsLocation1() {
        User user1 = mock(User.class);
        User user2 = mock(User.class);
        Locations locations = mock(Locations.class);

        when(locationsRepository.findByFromUserIdAndToUserId(user1.getId(), user2.getId()))
                .thenReturn(locations);

        Locations resultLocations = userService.getLocations(user1, user2);

        assertThat(resultLocations).isEqualTo(locations);
    }

    @Test
    public void getLocations_returnsLocation2() {
        User user1 = mock(User.class);
        User user2 = mock(User.class);
        Locations locations2 = mock(Locations.class);

        when(locationsRepository.findByFromUserIdAndToUserId(user1.getId(), user2.getId()))
                .thenReturn(null);
        when(locationsRepository.findByFromUserIdAndToUserId(user2.getId(), user1.getId()))
                .thenReturn(locations2);

        Locations resultLocations = userService.getLocations(user1, user2);

        assertThat(resultLocations).isEqualTo(locations2);
    }


}
