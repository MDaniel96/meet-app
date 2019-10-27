package com.meetupp.restmeetupp.controller;

import com.meetupp.restmeetupp.model.Comment;
import com.meetupp.restmeetupp.model.Event;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.model.UserComment;
import com.meetupp.restmeetupp.service.EventService;
import com.meetupp.restmeetupp.service.UserIdentifier;
import com.meetupp.restmeetupp.service.UserService;
import com.meetupp.restmeetupp.util.Consts;
import com.meetupp.restmeetupp.util.Util;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(Consts.EndpointBase.EVENT)
public class EventController {

    private EventService eventService;
    private UserIdentifier userIdentifier;
    private UserService userService;

    public EventController(EventService eventService, UserIdentifier userIdentifier, UserService userService) {
        this.eventService = eventService;
        this.userIdentifier = userIdentifier;
        this.userService = userService;
    }

    /**
     * Gets all upcoming events of user ordered by their date
     * @param token logged in user
     * @return list of events of user
     */
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<Event>> getUsersEvents(@RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        Set<Event> events = user.getEvents();

        List<Event> eventList = new ArrayList<>(events);
        eventService.deleteOldEvents(eventList);
        eventService.countPeople(eventList);
        eventList.sort(Comparator.comparingLong(Event::getSecs));
        return ResponseEntity.ok(eventList);
    }

    /**
     * Adds new event to db and user
     * @param token logged in user
     * @param newEvent event given in body
     * @return created event
     */
    @PostMapping
    @ResponseBody
    public ResponseEntity<Event> addEvent(@RequestHeader("Authorization") String token,
                                          @RequestBody Event newEvent) {
        User user = userIdentifier.identify(token);
        this.eventService.addEvent(user, newEvent);
        return ResponseEntity.ok(newEvent);
    }

    /**
     * Deletes relation between event end user (not from db or other users)
     * @param eventId event to be deleted
     * @param token logged in user
     * @return deleted event
     */
    @DeleteMapping("/{eventId}")
    @ResponseBody
    public ResponseEntity<Event> deleteEventFromUser(@PathVariable("eventId") Long eventId,
                                                     @RequestHeader("Authorization") String token) {
        Event event = eventService.getEventById(eventId);
        User user = userIdentifier.identify(token);

        if (event != null) {
            eventService.deleteEventFromUser(user, event);
            return ResponseEntity.ok(event);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Adds a list of users to event
     * @param eventId event to add users to
     * @param friends list of users
     * @param token logged in user
     * @return selected event
     */
    @PostMapping("/{eventId}/addFriends")
    @ResponseBody
    public ResponseEntity<Event> addFriendsToEvent(@PathVariable("eventId") Long eventId,
                                                   @RequestBody List<User> friends,
                                                   @RequestHeader("Authorization") String token) {
        Event event = eventService.getEventById(eventId);

        if (event != null) {
            for (User friend : friends) {
                User foundUser = userService.findUserById(friend.getId());
                eventService.addEvent(foundUser, event);
            }
            return ResponseEntity.ok(event);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Logged in user's public events
     * @param keyword part of name of event
     * @param token logged in user
     * @return logged in user's events
     */
    @GetMapping("/search/my/{keyword}")
    @ResponseBody
    public ResponseEntity<List<Event>> searchMyEvents(@PathVariable("keyword") String keyword,
                                                      @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        List<Event> events = eventService.searchByNameForMyEvents(user, keyword);
        return ResponseEntity.ok(events);
    }

    /**
     * Other (not-logged-in-user's) public events
     * @param keyword part of name of event
     * @param token logged in user
     * @return other public events
     */
    @GetMapping("/search/other/{keyword}")
    @ResponseBody
    public ResponseEntity<List<Event>> searchOtherEvents(@PathVariable("keyword") String keyword,
                                                         @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        List<Event> events = eventService.searchByNameForOtherEvents(user, keyword);
        return ResponseEntity.ok(events);
    }

    /**
     * Adding new comment to event
     * @param eventId event to add comment
     * @param text comment message
     * @param token logged in user
     * @return added comment
     */
    @PostMapping("/{eventId}/comment/{text}")
    @ResponseBody
    public ResponseEntity<Comment> addCommentToEvent(@PathVariable("eventId") Long eventId,
                                                     @PathVariable("text") String text,
                                                     @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        return ResponseEntity.ok(eventService.addCommentToEvent(user, eventId, text));
    }

    @GetMapping("/{eventId}/users")
    @ResponseBody
    public ResponseEntity<List<UserComment>> getUsersWithComments(@PathVariable("eventId") Long eventId,
                                                                  @RequestHeader("Authorization") String token) {
        User user = userIdentifier.identify(token);
        Event event = eventService.getEventById(eventId);

        if (event != null) {
            List<User> usersWithDistances = (new Util()).usersWithDistances(new ArrayList<>(event.getUsers_()), user);

            List<UserComment> userComments = new ArrayList<>();
            for (User u : usersWithDistances) {
                UserComment userComment = new UserComment();
                userComment.setUser(u);
                userComment.setComment(eventService.findCommentByUserAndEvent(u.getId(), event.getId()));
                userComments.add(userComment);
            }
            return ResponseEntity.ok(userComments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
