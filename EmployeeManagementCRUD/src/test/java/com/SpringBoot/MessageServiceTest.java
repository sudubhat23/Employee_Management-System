package com.SpringBoot;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.Rpository.MessageRepo;
import com.SpringBoot.Rpository.UserRepo;
import com.SpringBoot.entity.ChatMessage;
import com.SpringBoot.entity.User;
import com.SpringBoot.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {

    @Mock
    private MessageRepo messageRepo;

    @Mock
    private UserRepo userRepo;

    @Mock
    private EmployeeRepo employeeRepo;

    @InjectMocks
    private MessageService messageService;

    private ChatMessage message;

    @BeforeEach
    void setUp() {
        message = new ChatMessage(1L, "sarah", "Sarah Connor", "Principal Engineer", "alex", "Alexander Wright", null, "PROJECT", "Sprint review update", LocalDateTime.now(), false);
    }

    @Test
    void testSendMessage_EnrichesDetailsAndSaves() {
        User sender = new User(1, "Sarah", "Connor", "sarah", "sarah@company.com", "pass", "ROLE_EMPLOYEE");
        when(userRepo.findByUsername("sarah")).thenReturn(sender);
        when(messageRepo.save(any(ChatMessage.class))).thenAnswer(i -> i.getArgument(0));

        ChatMessage newMsg = new ChatMessage();
        newMsg.setSenderUsername("sarah");
        newMsg.setRecipientUsername("alex");
        newMsg.setContent("Test message");

        ChatMessage result = messageService.sendMessage(newMsg);

        assertNotNull(result);
        assertEquals("Sarah Connor", result.getSenderName());
        assertEquals("ROLE_EMPLOYEE", result.getSenderRole());
        verify(messageRepo, times(1)).save(newMsg);
    }

    @Test
    void testGetChannelMessages() {
        ChatMessage chanMsg = new ChatMessage(2L, "admin", "Admin", "Admin", "ALL", "All", "engineering", "GENERAL", "Hello Eng", LocalDateTime.now(), true);
        when(messageRepo.findByChannelIgnoreCaseOrderByTimestampAsc("engineering")).thenReturn(Arrays.asList(chanMsg));

        List<ChatMessage> list = messageService.getChannelMessages("engineering");

        assertEquals(1, list.size());
        assertEquals("Hello Eng", list.get(0).getContent());
    }

    @Test
    void testMarkAsRead() {
        when(messageRepo.findById(1L)).thenReturn(Optional.of(message));
        when(messageRepo.save(any(ChatMessage.class))).thenAnswer(i -> i.getArgument(0));

        boolean marked = messageService.markAsRead(1L);

        assertTrue(marked);
        assertTrue(message.getIsRead());
    }
}
