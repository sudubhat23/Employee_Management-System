package com.SpringBoot;

import com.SpringBoot.Rpository.EmployeeRepo;
import com.SpringBoot.entity.EmployeeEntity;
import com.SpringBoot.service.AiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AiServiceTest {

    @Mock
    private EmployeeRepo employeeRepo;

    @InjectMocks
    private AiService aiService;

    private EmployeeEntity emp1;
    private EmployeeEntity emp2;

    @BeforeEach
    void setUp() {
        emp1 = new EmployeeEntity(1, "Sarah", "Connor", "sarah@techcorp.com", "+1-555-0101", 32, "Engineering", "Principal Engineer", 125000.0, "ACTIVE", null, "avatar1.png");
        emp2 = new EmployeeEntity(2, "Alexander", "Wright", "alex@techcorp.com", "+1-555-0102", 28, "Design", "Senior Designer", 95000.0, "ACTIVE", null, "avatar2.png");
    }

    @Test
    void testAiResponseForEmployeeDetails() {
        when(employeeRepo.findAll()).thenReturn(Arrays.asList(emp1, emp2));

        String reply = aiService.generateIntelligentResponse("Tell me about Sarah Connor and her details");

        assertNotNull(reply);
        assertTrue(reply.contains("Sarah Connor"));
        assertTrue(reply.contains("Principal Engineer"));
        assertTrue(reply.contains("Engineering"));
        assertTrue(reply.contains("sarah@techcorp.com"));
    }

    @Test
    void testAiResponseForDepartmentBreakdown() {
        when(employeeRepo.findAll()).thenReturn(Arrays.asList(emp1, emp2));

        String reply = aiService.generateIntelligentResponse("How many employees in each department?");

        assertNotNull(reply);
        assertTrue(reply.contains("Department Headcount & Distribution"));
        assertTrue(reply.contains("Engineering"));
        assertTrue(reply.contains("Design"));
    }

    @Test
    void testAiResponseForHrPolicy() {
        when(employeeRepo.findAll()).thenReturn(Arrays.asList(emp1, emp2));

        String reply = aiService.generateIntelligentResponse("What is the company leave policy?");

        assertNotNull(reply);
        assertTrue(reply.contains("HR Policy"));
        assertTrue(reply.contains("Vacation"));
        assertTrue(reply.contains("Sick Leave"));
    }

    @Test
    void testAiResponseForDraftAnnouncement() {
        when(employeeRepo.findAll()).thenReturn(Arrays.asList(emp1, emp2));

        String reply = aiService.generateIntelligentResponse("Draft an announcement email for the team");

        assertNotNull(reply);
        assertTrue(reply.contains("Draft Official Corporate Announcement"));
        assertTrue(reply.contains("Townhall"));
    }

    @Test
    void testProcessChatReturnsValidPayload() {
        when(employeeRepo.findAll()).thenReturn(Arrays.asList(emp1, emp2));

        Map<String, Object> result = aiService.processChat("Hello Nexus AI", null);

        assertNotNull(result);
        assertTrue(result.containsKey("reply"));
        assertTrue(result.containsKey("source"));
    }
}
