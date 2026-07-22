package com.jankalyan.complainthistory.repository;

import com.jankalyan.category.entity.Category;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import com.jankalyan.complainthistory.entity.ComplaintStatusHistory;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ComplaintStatusHistoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    private User createTestUser() {
        User user = User.builder()
                .email("history" + System.currentTimeMillis() + "@test.com")
                .passwordHash("hash")
                .role(RoleType.USER)
                .fullName("Test User")
                .build();
        return entityManager.persistAndFlush(user);
    }

    private Complaint createTestComplaint(User user) {
        Category category = new Category();
        category.setName("Category " + System.currentTimeMillis());
        category.setDepartment("Test Dept");
        category.setDescription("Desc");
        entityManager.persistAndFlush(category);

        Complaint complaint = Complaint.builder()
                .user(user).category(category).title("T").description("D").build();
        return entityManager.persistAndFlush(complaint);
    }

    @Test
    void shouldFindHistoryByComplaintIdOrderedByCreatedAtDesc() throws InterruptedException {
        User user = createTestUser();
        Complaint complaint = createTestComplaint(user);

        ComplaintStatusHistory h1 = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .oldStatus(ComplaintStatus.SUBMITTED)
                .newStatus(ComplaintStatus.UNDER_REVIEW)
                .changedBy(user)
                .build();
        entityManager.persistAndFlush(h1);
        
        Thread.sleep(10); // Ensure timestamp difference for descending order

        ComplaintStatusHistory h2 = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .oldStatus(ComplaintStatus.UNDER_REVIEW)
                .newStatus(ComplaintStatus.APPROVED)
                .changedBy(user)
                .build();
        entityManager.persistAndFlush(h2);

        List<ComplaintStatusHistory> historyList = historyRepository.findByComplaintIdOrderByCreatedAtDesc(complaint.getId());

        assertThat(historyList).hasSize(2);
        assertThat(historyList.get(0).getNewStatus()).isEqualTo(ComplaintStatus.APPROVED);
        assertThat(historyList.get(1).getNewStatus()).isEqualTo(ComplaintStatus.UNDER_REVIEW);
    }
}
