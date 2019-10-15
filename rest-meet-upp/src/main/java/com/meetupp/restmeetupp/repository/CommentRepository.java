package com.meetupp.restmeetupp.repository;

import com.meetupp.restmeetupp.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    Comment findByUserIdAndEventId(Long userId, Long eventId);

}
