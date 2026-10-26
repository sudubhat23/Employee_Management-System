package com.SpringBoot.Rpository;

import com.SpringBoot.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChannelIgnoreCaseOrderByTimestampAsc(String channel);

    @Query("SELECT m FROM ChatMessage m WHERE m.channel IS NULL AND " +
           "((LOWER(m.senderUsername) = LOWER(:u1) AND LOWER(m.recipientUsername) = LOWER(:u2)) OR " +
           "(LOWER(m.senderUsername) = LOWER(:u2) AND LOWER(m.recipientUsername) = LOWER(:u1))) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findDirectMessages(@Param("u1") String u1, @Param("u2") String u2);

    @Query("SELECT m FROM ChatMessage m WHERE LOWER(m.recipientUsername) = LOWER(:username) OR " +
           "LOWER(m.senderUsername) = LOWER(:username) OR m.recipientUsername = 'ALL' " +
           "ORDER BY m.timestamp DESC")
    List<ChatMessage> findUserFeed(@Param("username") String username);

    long countByRecipientUsernameIgnoreCaseAndIsReadFalse(String recipientUsername);

    List<ChatMessage> findTop30ByOrderByTimestampDesc();
}
