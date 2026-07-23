package com.jankalyan.notification.service;

import com.jankalyan.notification.dto.response.NotificationResponse;
import com.jankalyan.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

public interface NotificationService {

    Page<NotificationResponse> getUserNotifications(UUID userId, int page, int size);

    long getUnreadCount(UUID userId);

    void markAsRead(UUID notificationId, UUID userId);

    void markAllAsRead(UUID userId);

    SseEmitter subscribe(UUID userId);
}
