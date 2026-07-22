package com.jankalyan.vote.repository;

import com.jankalyan.category.entity.Category;
import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.vote.entity.Vote;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class VoteRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private VoteRepository voteRepository;

    private User createTestUser() {
        User user = User.builder()
                .email("vote" + System.currentTimeMillis() + "@test.com")
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
    void shouldFindVoteByComplaintIdAndUserId() {
        User user = createTestUser();
        Complaint complaint = createTestComplaint(user);

        Vote vote = Vote.builder().user(user).complaint(complaint).build();
        entityManager.persistAndFlush(vote);

        Optional<Vote> found = voteRepository.findByComplaintIdAndUserId(complaint.getId(), user.getId());
        assertThat(found).isPresent();
    }

    @Test
    void shouldCheckIfVoteExists() {
        User user = createTestUser();
        Complaint complaint = createTestComplaint(user);

        Vote vote = Vote.builder().user(user).complaint(complaint).build();
        entityManager.persistAndFlush(vote);

        boolean exists = voteRepository.existsByComplaintIdAndUserId(complaint.getId(), user.getId());
        assertThat(exists).isTrue();
    }

    @Test
    void shouldCountVotesByComplaint() {
        User user1 = createTestUser();
        User user2 = createTestUser();
        Complaint complaint = createTestComplaint(user1);

        Vote vote1 = Vote.builder().user(user1).complaint(complaint).build();
        Vote vote2 = Vote.builder().user(user2).complaint(complaint).build();
        
        entityManager.persist(vote1);
        entityManager.persist(vote2);
        entityManager.flush();

        long count = voteRepository.countByComplaintId(complaint.getId());
        assertThat(count).isEqualTo(2);
    }
}
