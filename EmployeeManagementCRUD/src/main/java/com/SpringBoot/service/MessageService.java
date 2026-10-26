package com.SpringBoot.service;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.Rpository.MessageRepo;
import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.ChatMessage;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    public ChatMessage sendMessage(ChatMessage message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // Auto-enrich sender details if not populated
        if (message.getSenderName() == null || message.getSenderName().isBlank()) {
            User senderUser = userRepo.findByUsername(message.getSenderUsername());
            if (senderUser != null) {
                message.setSenderName(senderUser.getFirstname() + " " + (senderUser.getLastname() != null ? senderUser.getLastname() : ""));
                if (message.getSenderRole() == null) {
                    message.setSenderRole(senderUser.getRole());
                }
            }
        }

        // Auto-enrich recipient name if direct message
        if (message.getChannel() == null && message.getRecipientUsername() != null && !message.getRecipientUsername().equalsIgnoreCase("ALL")) {
            User recipUser = userRepo.findByUsername(message.getRecipientUsername());
            if (recipUser != null && (message.getRecipientName() == null || message.getRecipientName().isBlank())) {
                message.setRecipientName(recipUser.getFirstname() + " " + (recipUser.getLastname() != null ? recipUser.getLastname() : ""));
            }
        }

        return messageRepo.save(message);
    }

    public List<ChatMessage> getChannelMessages(String channel) {
        return messageRepo.findByChannelIgnoreCaseOrderByTimestampAsc(channel);
    }

    public List<ChatMessage> getDirectMessages(String user1, String user2) {
        return messageRepo.findDirectMessages(user1, user2);
    }

    public List<ChatMessage> getUserFeed(String username) {
        return messageRepo.findUserFeed(username);
    }

    public long getUnreadCount(String username) {
        return messageRepo.countByRecipientUsernameIgnoreCaseAndIsReadFalse(username);
    }

    public boolean markAsRead(Long messageId) {
        Optional<ChatMessage> opt = messageRepo.findById(messageId);
        if (opt.isPresent()) {
            ChatMessage msg = opt.get();
            msg.setIsRead(true);
            messageRepo.save(msg);
            return true;
        }
        return false;
    }
}
