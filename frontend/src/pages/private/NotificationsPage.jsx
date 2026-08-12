import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Check, Clock, Inbox } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { notificationsQuery, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'RESOLUTION': return <CheckCircle2 className="text-green-500" />;
      case 'REJECTION': return <AlertTriangle className="text-red-500" />;
      case 'STATUS_UPDATE': return <Info className="text-blue-500" />;
      default: return <Bell className="text-muted-foreground" />;
    }
  };

  const notifications = notificationsQuery.data?.content || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <Bell className="mr-3 text-primary" size={32} />
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
          >
            <Check className="mr-2" size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {notificationsQuery.isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <Inbox className="mx-auto mb-4 opacity-50" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">No notifications yet</h3>
            <p>Updates on your filed complaints will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-6 transition-colors ${!notification.read ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-base font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <Clock size={14} className="mr-1.5" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Link
                          to={notification.actionUrl}
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => markAsRead.mutate(notification.id)}
                        className="text-xs font-medium text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Mark read
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
