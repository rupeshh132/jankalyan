package com.jankalyan.auth.service;

import com.jankalyan.auth.entity.Otp;
import com.jankalyan.auth.repository.OtpRepository;
import com.jankalyan.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private static final int OTP_VALIDITY_MINUTES = 10;

    @Transactional
    public String generateAndSaveOtp(String email) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        Otp otp = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES))
                .isUsed(false)
                .build();
                
        otpRepository.save(otp);
        return otpCode;
    }

    @Transactional
    public boolean validateOtp(String email, String otpCode) {
        Otp otp = otpRepository.findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BadRequestException("No valid OTP found or it has expired"));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (!otp.getOtpCode().equals(otpCode)) {
            throw new BadRequestException("Invalid OTP code.");
        }

        otp.setUsed(true);
        otpRepository.save(otp);
        return true;
    }
}
