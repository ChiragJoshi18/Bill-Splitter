import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Bell, 
    Receipt,
    CreditCard,
    Users,
    Mail,
    Clock,
    ArrowRight
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Notification {
  id: string;
  type: 'new_expense' | 'new_settlement' | 'settlement_update' | 'group_invitation';
  title: string;
  message: string;
  data: any;
  created_at: string;
  is_read: boolean;
}

interface Props {
  notifications: Notification[];
  unreadCount: number;
  user: {
    id: number;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

export default function NotificationList({ notifications, unreadCount, user }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_expense':
        return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'new_settlement':
      case 'settlement_update':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'group_invitation':
        return <Users className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'new_expense':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            Expense
          </Badge>
        );
      case 'new_settlement':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Settlement
          </Badge>
        );
      case 'settlement_update':
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
            Update
          </Badge>
        );
      case 'group_invitation':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
            Invitation
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate based on notification type
    switch (notification.type) {
      case 'new_expense':
        window.location.href = `/expenses`;
        break;
      case 'new_settlement':
      case 'settlement_update':
        window.location.href = `/settlements`;
        break;
      case 'group_invitation':
        window.location.href = `/invites`;
        break;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your latest activities
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications ({notifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  When you have new expenses, settlements, or invitations, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50/50 border-blue-200' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          {getNotificationBadge(notification.type)}
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 