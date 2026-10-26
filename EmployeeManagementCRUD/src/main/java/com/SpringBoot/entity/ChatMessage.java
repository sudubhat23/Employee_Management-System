package com.SpringBoot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderUsername;

    private String senderName;

    private String senderRole;

    @Column(nullable = false)
    private String recipientUsername; // Specific username, or "ALL", or "DEPT_ENGINEERING", etc.

    private String recipientName;

    private String channel; // e.g. "general", "engineering", "hr", "announcements", or null for direct messages

    private String category = "GENERAL"; // GENERAL, URGENT, PROJECT, HR_INQUIRY, ANNOUNCEMENT

    @Column(length = 2000, nullable = false)
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();

    private Boolean isRead = false;

    public ChatMessage() {
    }

    public ChatMessage(Long id, String senderUsername, String senderName, String senderRole,
                       String recipientUsername, String recipientName, String channel,
                       String category, String content, LocalDateTime timestamp, Boolean isRead) {
        this.id = id;
        this.senderUsername = senderUsername;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.recipientUsername = recipientUsername;
        this.recipientName = recipientName;
        this.channel = channel;
        this.category = category != null ? category : "GENERAL";
        this.content = content;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.isRead = isRead;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsRead() {
        return isRead != null && isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead != null ? isRead : false;
    }
}
