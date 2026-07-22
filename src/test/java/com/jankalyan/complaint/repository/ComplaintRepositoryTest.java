package com.jankalyan.complaint.repository;

import com.jankalyan.category.entity.Category;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ComplaintRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ComplaintRepository complaintRepository;

    private User createTestUser() {
        User user = User.builder()
                .email("user" + System.currentTimeMillis() + "@test.com")
                .passwordHash("hash")
                .role(RoleType.USER)
                .fullName("Test User")
                .build();
        return entityManager.persistAndFlush(user);
    }

    private Category createTestCategory() {
        Category category = new Category();
        category.setName("Roads " + System.currentTimeMillis());
        category.setDepartment("Test Dept");
        category.setDescription("Test Category");
        return entityManager.persistAndFlush(category);
    }

    @Test
    void shouldFindActiveComplaintsByUserId() {
        User user = createTestUser();
        Category category = createTestCategory();

        Complaint c1 = Complaint.builder()
                .user(user).category(category).title("Complaint 1").description("Desc 1").isDeleted(false).build();
        Complaint c2 = Complaint.builder()
                .user(user).category(category).title("Complaint 2").description("Desc 2").isDeleted(true).build();
        
        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.flush();
        entityManager.clear();

        List<Complaint> activeComplaints = complaintRepository.findByUserIdAndIsDeletedFalse(user.getId());

        assertThat(activeComplaints).hasSize(1);
        Complaint retrievedComplaint = activeComplaints.get(0);
        assertThat(retrievedComplaint.getTitle()).isEqualTo("Complaint 1");
        assertThat(retrievedComplaint.getCategory()).isNotNull();
        assertThat(retrievedComplaint.getCategory().getName()).isEqualTo(category.getName());
    }

    @Test
    void shouldFindByIdAndIsDeletedFalse() {
        User user = createTestUser();
        Category category = createTestCategory();

        Complaint c1 = Complaint.builder()
                .user(user).category(category).title("Complaint 1").description("Desc 1").isDeleted(false).build();
        entityManager.persistAndFlush(c1);

        Optional<Complaint> found = complaintRepository.findByIdAndIsDeletedFalse(c1.getId());
        assertThat(found).isPresent();
    }

    @Test
    void shouldReturnDashboardStatistics() {
        User user = createTestUser();
        Category category = createTestCategory();

        Complaint c1 = Complaint.builder().user(user).category(category).title("T1").description("D").status(ComplaintStatus.SUBMITTED).isDeleted(false).build();
        Complaint c2 = Complaint.builder().user(user).category(category).title("T2").description("D").status(ComplaintStatus.UNDER_REVIEW).isDeleted(false).build();
        Complaint c3 = Complaint.builder().user(user).category(category).title("T3").description("D").status(ComplaintStatus.APPROVED).isDeleted(true).build(); // deleted, should not count
        
        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.persist(c3);
        entityManager.flush();

        var stats = complaintRepository.getDashboardStatistics();

        assertThat(stats.getTotalComplaints()).isEqualTo(2);
        assertThat(stats.getSubmittedCount()).isEqualTo(1);
        assertThat(stats.getUnderReviewCount()).isEqualTo(1);
        assertThat(stats.getApprovedCount()).isEqualTo(0);
    }

    @Test
    void shouldPaginateAndLoadEntityGraph() {
        User user = createTestUser();
        Category category = createTestCategory();

        Complaint c1 = Complaint.builder().user(user).category(category).title("T1").description("D").build();
        Complaint c2 = Complaint.builder().user(user).category(category).title("T2").description("D").build();
        
        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.flush();
        entityManager.clear();

        Page<Complaint> page = complaintRepository.findAll(PageRequest.of(0, 10));
        assertThat(page.getTotalElements()).isGreaterThanOrEqualTo(2);
        
        Complaint retrievedComplaint = page.getContent().get(0);
        assertThat(retrievedComplaint.getCategory()).isNotNull();
        assertThat(retrievedComplaint.getCategory().getName()).isEqualTo(category.getName());
    }
}
