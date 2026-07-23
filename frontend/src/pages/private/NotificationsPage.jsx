import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Check, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { notificationsQuery, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'RESOLUTION': return <CheckCircle2 className="text-green-500" />;
      case 'REJECTION': return <AlertTriangle className="text-red-500" />;
      case 'STATUS_UPDATE': return <Info className="text-blue-500" />;
      default: return <Bell className="text-gray-500" />;
    }
  };

  const notifications = notificationsQuery.data?.content || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Bell className="mr-3 text-blue-600" size={32} />
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <Check className="mr-2" size={18} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {notificationsQuery.isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Bell className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p>When you get notifications, they'll show up here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-6 transition-colors ${!notification.read ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-base font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <Clock size={14} className="mr-1.5" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Link
                          to={notification.actionUrl}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
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
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
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
