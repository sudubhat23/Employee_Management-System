package com.SpringBoot.controller;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.ChatMessage;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.entity.User;
import com.SpringBoot.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Official Communication API", description = "Endpoints for employee-to-employee official messaging and department broadcast channels")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private UserRepo userRepo;

    @Operation(summary = "Send an official message or channel broadcast")
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage saved = messageService.sendMessage(message);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Get messages for a department or announcement channel")
    @GetMapping("/channel/{channel}")
    public ResponseEntity<List<ChatMessage>> getChannelMessages(@PathVariable String channel) {
        return ResponseEntity.ok(messageService.getChannelMessages(channel));
    }

    @Operation(summary = "Get 1-on-1 direct message conversation history")
    @GetMapping("/direct")
    public ResponseEntity<List<ChatMessage>> getDirectMessages(
            @RequestParam String user1,
            @RequestParam String user2
    ) {
        return ResponseEntity.ok(messageService.getDirectMessages(user1, user2));
    }

    @Operation(summary = "Get user's personal message feed")
    @GetMapping("/feed/{username}")
    public ResponseEntity<List<ChatMessage>> getUserFeed(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getUserFeed(username));
    }

    @Operation(summary = "Get unread message count for user")
    @GetMapping("/unread-count/{username}")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@PathVariable String username) {
        long count = messageService.getUnreadCount(username);
        Map<String, Object> resp = new HashMap<>();
        resp.put("username", username);
        resp.put("unreadCount", count);
        return ResponseEntity.ok(resp);
    }

    @Operation(summary = "Mark a message as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        boolean success = messageService.markAsRead(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", success);
        return ResponseEntity.ok(resp);
    }

    @Operation(summary = "Get list of colleagues available for official chat")
    @GetMapping("/colleagues")
    public ResponseEntity<List<Map<String, Object>>> getColleagues() {
        List<EmployeeEntity> employees = employeeRepo.findAll();
        List<User> users = userRepo.findAll();

        Map<String, User> userByEmail = new HashMap<>();
        Map<String, User> userByUsername = new HashMap<>();
        for (User u : users) {
            if (u.getEmail() != null) userByEmail.put(u.getEmail().toLowerCase(), u);
            if (u.getUsername() != null) userByUsername.put(u.getUsername().toLowerCase(), u);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (EmployeeEntity emp : employees) {
            Map<String, Object> item = new HashMap<>();
            item.put("employeeId", emp.getId());
            item.put("name", emp.getName());
            item.put("email", emp.getEmail());
            item.put("role", emp.getRole());
            item.put("dept", emp.getDept());
            item.put("status", emp.getStatus());
            item.put("avatarUrl", emp.getAvatarUrl());

            // Deduce or link username
            String matchedUsername = emp.getEmail() != null ? emp.getEmail().split("@")[0].replace(".", "") : "emp" + emp.getId();
            if (emp.getEmail() != null && userByEmail.containsKey(emp.getEmail().toLowerCase())) {
                matchedUsername = userByEmail.get(emp.getEmail().toLowerCase()).getUsername();
            }
            item.put("username", matchedUsername);
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }
}
