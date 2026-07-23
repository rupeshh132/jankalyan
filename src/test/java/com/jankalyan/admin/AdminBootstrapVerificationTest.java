package com.jankalyan.admin;

import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdminBootstrapVerificationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testAdminSeederCreatesExactlyOneAdmin() {
        // The context has already loaded and CommandLineRunners have executed.
        boolean adminExists = userRepository.existsByRole(RoleType.ADMIN);
        assertThat(adminExists).isTrue();

        Optional<User> adminOpt = userRepository.findByEmail("admin@jankalyan.com");
        assertThat(adminOpt).isPresent();

        User admin = adminOpt.get();
        assertThat(admin.getRole()).isEqualTo(RoleType.ADMIN);
        assertThat(passwordEncoder.matches("Admin@123", admin.getPasswordHash())).isTrue();
    }
}
