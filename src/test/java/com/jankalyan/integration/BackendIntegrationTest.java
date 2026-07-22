package com.jankalyan.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jankalyan.admin.dto.request.UpdateComplaintStatusRequest;
import com.jankalyan.auth.dto.request.LoginRequest;
import com.jankalyan.auth.dto.request.RegisterRequest;
import com.jankalyan.category.entity.Category;
import com.jankalyan.category.repository.CategoryRepository;
import com.jankalyan.complaint.dto.request.CreateComplaintRequest;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complaint.repository.ComplaintRepository;
import com.jankalyan.complainthistory.repository.ComplaintStatusHistoryRepository;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import com.jankalyan.vote.repository.VoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BackendIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User normalUser;
    private Category category;

    @BeforeEach
    void setUp() {
        voteRepository.deleteAll();
        historyRepository.deleteAll();
        complaintRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        String adminEmail = "admin" + UUID.randomUUID() + "@jankalyan.com";
        adminUser = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .fullName("Admin User")
                .phone("9" + (100000000L + (long)(Math.random() * 900000000L)))
                .role(RoleType.ADMIN)
                .isActive(true)
                .build();
        userRepository.save(adminUser);

        String userEmail = "user" + UUID.randomUUID() + "@jankalyan.com";
        normalUser = User.builder()
                .email(userEmail)
                .passwordHash(passwordEncoder.encode("User@123"))
                .fullName("Normal User")
                .phone("8" + (100000000L + (long)(Math.random() * 900000000L)))
                .role(RoleType.USER)
                .isActive(true)
                .build();
        userRepository.save(normalUser);

        String categoryName = "Roads " + UUID.randomUUID();
        category = Category.builder()
                .name(categoryName)
                .description("Road issues")
                .department("PWD")
                .build();
        categoryRepository.save(category);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseStr = result.getResponse().getContentAsString();
        return objectMapper.readTree(responseStr).get("data").get("accessToken").asText();
    }

    private Complaint createTestComplaint(User user, Category cat) {
        Complaint complaint = Complaint.builder()
                .title("Test Complaint")
                .description("Test description")
                .category(cat)
                .user(user)
                .status(ComplaintStatus.SUBMITTED)
                .ward("Ward 1")
                .address("123 Street")
                .city("TestCity")
                .state("TestState")
                .pincode("123456")
                .latitude(BigDecimal.valueOf(12.34))
                .longitude(BigDecimal.valueOf(56.78))
                .build();
        return complaintRepository.saveAndFlush(complaint);
    }

    @Test
    void userRegistration_ShouldPersistUser() throws Exception {
        String email = "newuser" + UUID.randomUUID() + "@example.com";
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test Register");
        request.setEmail(email);
        request.setPhone("7" + (100000000L + (long)(Math.random() * 900000000L)));
        request.setPassword("Secure@123");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isCreated());

        assertThat(userRepository.findByEmail(email)).isPresent();
    }

    @Test
    void userLogin_ShouldReturnJwt() throws Exception {
        String token = loginAndGetToken(normalUser.getEmail(), "User@123");
        assertThat(token).isNotBlank();
    }

    @Test
    void createComplaint_ShouldSaveCorrectly() throws Exception {
        String token = loginAndGetToken(normalUser.getEmail(), "User@123");

        CreateComplaintRequest request = new CreateComplaintRequest();
        request.setTitle("Road Pothole");
        request.setDescription("Large pothole on main street");
        request.setCategoryId(category.getId());
        request.setWard("Ward 2");
        request.setAddress("456 Avenue");
        request.setCity("TestCity");
        request.setState("TestState");
        request.setPincode("654321");
        request.setLatitude(BigDecimal.valueOf(11.11));
        request.setLongitude(BigDecimal.valueOf(22.22));

        mockMvc.perform(post("/api/v1/complaints")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        assertThat(complaintRepository.findAll()).hasSize(1);
        Complaint saved = complaintRepository.findAll().get(0);
        assertThat(saved.getTitle()).isEqualTo("Road Pothole");
        assertThat(saved.getStatus()).isEqualTo(ComplaintStatus.SUBMITTED);
    }

    @Test
    void publicComplaintListing_ShouldPaginateAndExcludeSoftDeleted() throws Exception {
        Complaint activeComplaint = createTestComplaint(normalUser, category);
        
        Complaint deletedComplaint = createTestComplaint(normalUser, category);
        deletedComplaint.setDeleted(true);
        complaintRepository.saveAndFlush(deletedComplaint);

        String token = loginAndGetToken(normalUser.getEmail(), "User@123");
        mockMvc.perform(get("/api/v1/complaints?page=0&size=10")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].id").value(activeComplaint.getId().toString()));
    }

    @Test
    void adminStatusUpdate_ShouldTransitionAndCreateHistory() throws Exception {
        Complaint complaint = createTestComplaint(normalUser, category);
        String token = loginAndGetToken(adminUser.getEmail(), "Admin@123");

        UpdateComplaintStatusRequest request = new UpdateComplaintStatusRequest();
        request.setStatus(ComplaintStatus.UNDER_REVIEW);

        mockMvc.perform(patch("/api/v1/admin/complaints/" + complaint.getId() + "/status")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        Complaint updated = complaintRepository.findById(complaint.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(ComplaintStatus.UNDER_REVIEW);

        assertThat(historyRepository.findAll()).hasSize(1);
        assertThat(historyRepository.findAll().get(0).getNewStatus()).isEqualTo(ComplaintStatus.UNDER_REVIEW);
    }

    @Test
    void adminSoftDelete_ShouldNotPhysicallyDelete() throws Exception {
        Complaint complaint = createTestComplaint(normalUser, category);
        String token = loginAndGetToken(adminUser.getEmail(), "Admin@123");

        mockMvc.perform(delete("/api/v1/admin/complaints/" + complaint.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());

        Complaint deleted = complaintRepository.findById(complaint.getId()).orElseThrow();
        assertThat(deleted.isDeleted()).isTrue();
    }

    @Test
    void voting_ShouldSaveVoteAndRejectDuplicate() throws Exception {
        Complaint complaint = createTestComplaint(adminUser, category); // Created by admin
        String token = loginAndGetToken(normalUser.getEmail(), "User@123");

        // First vote
        mockMvc.perform(post("/api/v1/complaints/" + complaint.getId() + "/vote")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isCreated());

        assertThat(voteRepository.findAll()).hasSize(1);

        // Duplicate vote
        mockMvc.perform(post("/api/v1/complaints/" + complaint.getId() + "/vote")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isBadRequest());

        assertThat(voteRepository.findAll()).hasSize(1); // Still 1
    }
}
