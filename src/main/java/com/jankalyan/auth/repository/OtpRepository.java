package com.jankalyan.auth.repository;

import com.jankalyan.auth.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<Otp, UUID> {
    Optional<Otp> findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(String email);
    void deleteByExpiryTimeBefore(LocalDateTime time);
}
