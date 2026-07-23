package com.jankalyan.notification.event;

import com.jankalyan.notification.entity.NotificationType;
import com.jankalyan.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class NotificationEvent extends ApplicationEvent {

    private final User user;
    private final String title;
    private final String message;
    private final NotificationType type;
    private final UUID referenceId;
    private final String actionUrl;

    @Builder
    public NotificationEvent(Object source, User user, String title, String message, NotificationType type, UUID referenceId, String actionUrl) {
        super(source);
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.actionUrl = actionUrl;
    }
}
