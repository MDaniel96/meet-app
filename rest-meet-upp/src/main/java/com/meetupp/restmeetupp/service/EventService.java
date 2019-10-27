package com.meetupp.restmeetupp.service;

import com.meetupp.restmeetupp.model.Comment;
import com.meetupp.restmeetupp.model.Event;
import com.meetupp.restmeetupp.model.User;
import com.meetupp.restmeetupp.repository.CommentRepository;
import com.meetupp.restmeetupp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CommentRepository commentRepository;

    /**
     * Deletes old events from list (not from DB)
     * @param eventList events to delete from
     */
    public void deleteOldEvents(List<Event> eventList) {
        List<Event> eventsToDelete = new ArrayList<>();
        for (Event event : eventList) {
            if (event.getTime().getTime() < (new Date()).getTime()) {
                eventsToDelete.add(event);
            }
        }
        eventList.removeAll(eventsToDelete);
    }

    /**
     * Adds new event to db and user
     */
    public void addEvent(User user, Event event) {
        user.getEvents().add(event);
        event.getUsers_().add(user);
        eventRepository.save(event);
    }

    /**
     * Deletes users and events relation (but not the event)
     */
    public void deleteEventFromUser(User user, Event event) {
        user.getEvents().remove(event);
        event.getUsers_().remove(user);
        eventRepository.save(event);
    }

    /**
     * Sets countPeople in list according to event participants number
     */
    public void countPeople(List<Event> eventList) {
        for (Event event : eventList) {
            event.setPeopleCount(event.getUsers_().size());
        }
    }

    /**
     * Search for user's events by event name
     * @param user user
     * @param name search keyword
     * @return events of user
     */
    public List<Event> searchByNameForMyEvents(User user, String name) {
        List<Event> events = searchAllByKeyword(name);
        events.removeIf(event -> !user.getEvents().contains(event));
        return events;
    }

    /**
     * Search for other (not user's) events by event name
     * @param user user
     * @param name search keyword
     * @return public events of not-user
     */
    public List<Event> searchByNameForOtherEvents(User user, String name) {
        List<Event> events = searchAllByKeyword(name);
        events.removeIf(event -> !event.isPublic());
        events.removeIf(event -> user.getEvents().contains(event));
        return events;
    }

    /**
     * Search for public all events by keyword
     */
    private List<Event> searchAllByKeyword(String name) {
        List<Event> events = eventRepository.findAllByNameContainsIgnoreCase(name);
        deleteOldEvents(events);
        return events;
    }

    /**
     * Adding comment to event from user
     */
    public Comment addCommentToEvent(User user, Long eventId, String text) {
        Comment comment = commentRepository.findByUserIdAndEventId(user.getId(), eventId);
        if (comment == null) {
            comment = new Comment();
        }
        comment.setText(text);
        comment.setUserId(user.getId());
        comment.setEventId(eventId);
        commentRepository.save(comment);
        return comment;
    }

    /**
     * Finding comment by user and event
     */
    public Comment findCommentByUserAndEvent(Long userId, Long eventId) {
        return commentRepository.findByUserIdAndEventId(userId, eventId);
    }

    public Event getEventById(Long id) {
        return this.eventRepository.findById(id);
    }
}
