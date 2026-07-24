package com.jankalyan.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("JanKalyan - Your Login OTP");
            
            String htmlContent = String.format(
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;\">" +
                "  <h2 style=\"color: #007bff; text-align: center;\">JanKalyan OTP Verification</h2>" +
                "  <p>Hello,</p>" +
                "  <p>You requested an OTP for verifying your account. Please use the following One-Time Password (OTP) to proceed:</p>" +
                "  <div style=\"background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 4px; margin: 20px 0;\">" +
                "    %s" +
                "  </div>" +
                "  <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>" +
                "  <p>If you didn't request this, please ignore this email.</p>" +
                "  <br>" +
                "  <p>Best regards,<br>Team JanKalyan</p>" +
                "</div>",
                otpCode
            );
            
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("OTP email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send email");
        }
    }
}
