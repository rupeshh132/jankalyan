package com.jankalyan.user.config;

import com.jankalyan.user.entity.RoleType;
import com.jankalyan.user.entity.User;
import com.jankalyan.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (!userRepository.existsByRole(RoleType.ADMIN)) {
            log.info("No admin user found. Creating default admin account...");
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@jankalyan.com")
                    .phone("0000000000")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(RoleType.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin account created successfully.");
        } else {
            log.info("Admin user already exists. Skipping admin seeding.");
        }
    }
}
