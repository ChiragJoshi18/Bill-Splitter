import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Invitation {
  id: number;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  group: {
    id: number;
    name: string;
  };
  inviter: {
    id: number;
    name: string;
  };
}

interface Props {
  invitations: Invitation[];
  user: {
    id: number;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Invites',
    href: '/invites',
  },
];

export default function InviteList({ invitations, user }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'accepted') {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Accepted
        </Badge>
      );
    } else if (status === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Invites" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invites</h1>
            <p className="text-muted-foreground mt-1">
              Track all invitations you've sent to join your groups
            </p>
          </div>
        </div>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Sent Invitations ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invitations sent yet</h3>
                <p className="text-muted-foreground">
                  When you invite people to your groups, they will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">#</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Group</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Invited On</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation, index) => (
                      <tr key={invitation.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {invitation.email}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {invitation.group.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(invitation.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(invitation.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 