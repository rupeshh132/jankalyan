package com.jankalyan.user.repository;

import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindByEmail() {
        User user = User.builder()
                .email("test@test.com")
                .passwordHash("encodedPassword")
                .role(RoleType.USER)
                .fullName("Test User")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        Optional<User> found = userRepository.findByEmail("test@test.com");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@test.com");
    }

    @Test
    void shouldReturnTrueWhenEmailExists() {
        User user = User.builder()
                .email("exist@test.com")
                .passwordHash("encodedPassword")
                .role(RoleType.USER)
                .fullName("Exist User")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        boolean exists = userRepository.existsByEmail("exist@test.com");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldReturnFalseWhenEmailDoesNotExist() {
        boolean exists = userRepository.existsByEmail("notfound@test.com");
        assertThat(exists).isFalse();
    }

    @Test
    void shouldReturnTrueWhenPhoneExists() {
        User user = User.builder()
                .email("phone@test.com")
                .phone("1234567890")
                .passwordHash("encodedPassword")
                .role(RoleType.USER)
                .fullName("Phone User")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        boolean exists = userRepository.existsByPhone("1234567890");

        assertThat(exists).isTrue();
    }
}
