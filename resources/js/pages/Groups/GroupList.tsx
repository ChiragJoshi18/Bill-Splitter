import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FlashMessage from '@/components/flash-message';
import { useToast } from '@/components/ui/toast';
import { 
  Plus, 
  Users, 
  Calendar,
  UserPlus,
  Pencil,
  Trash2,
  Mail
} from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import InviteMemberModal from './InviteMemberModal';
import GroupDetailsModal from './GroupDetailsModal';
import { type BreadcrumbItem } from '@/types';

interface User {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  created_at: string;
  users: User[];
  users_count: number;
  expenses_count: number;
  total_expenses: number;
  user_share: number;
  user_paid: number;
  user_balance: number;
}

interface Props {
  groups: Group[];
  user: {
    id: number;
    name: string;
    currency_symbol: string;
  };
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Groups',
    href: '/groups',
  },
];

export default function GroupList({ groups, user }: Props) {
  const page = usePage();
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);
  const [inviteGroup, setInviteGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  
  // Update local groups when props change
  React.useEffect(() => {
    setLocalGroups(groups);
  }, [groups]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Groups" />
      
      <FlashMessage 
        success={(page.props.flash as any)?.success}
        error={(page.props.flash as any)?.error}
        warning={(page.props.flash as any)?.warning}
        info={(page.props.flash as any)?.info}
      />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
            <p className="text-muted-foreground mt-1">
              Manage your expense groups and track shared expenses
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => setInviteGroup({ id: 0, name: '', description: '', created_by: 0, created_at: '', users: [], users_count: 0, expenses_count: 0, total_expenses: 0, user_share: 0, user_paid: 0, user_balance: 0 })} 
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 transition-all duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Invite Users
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

                {/* Groups Grid */}
        {localGroups.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first group to start splitting expenses with friends and family.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localGroups.map((group) => (
                <Card 
                  key={group.id} 
                  className="group hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                      {group.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {group.description}
                        </CardDescription>
                      )}
                    </div>
                    {group.created_by === user.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInviteGroup(group);
                          }}
                          className="h-8 w-8 p-0"
                          title="Invite Member"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditGroup(group);
                          }}
                          className="h-8 w-8 p-0"
                          title="Edit Group"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteGroup(group);
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          title="Delete Group"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(group.created_at)}</span>
                  </div>

                  {/* Members */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Members ({group.users_count})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.users.map((member) => (
                        <span
                          key={member.id}
                          className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white"
                        >
                          {member.id === user.id ? 'You' : member.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Expenses:</span>
                    <span className="font-medium">{group.expenses_count}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateGroupModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={(newGroup: any) => {
            setLocalGroups(prev => [...prev, newGroup]);
          }}
        />
      )}
      
      {editGroup && (
        <EditGroupModal 
          group={editGroup} 
          onClose={() => setEditGroup(null)}
          onGroupUpdated={(groupId, updatedData) => {
            setLocalGroups(prev => prev.map(group => 
              group.id === groupId 
                ? { ...group, ...updatedData }
                : group
            ));
          }}
        />
      )}
      
      {deleteGroup && (
        <DeleteGroupModal 
          group={deleteGroup} 
          onClose={() => setDeleteGroup(null)}
          onGroupDeleted={(groupId) => {
            setLocalGroups(prev => prev.filter(group => group.id !== groupId));
          }}
        />
      )}
      
      {inviteGroup && (
        <InviteMemberModal 
          open={!!inviteGroup}
          groupId={inviteGroup.id === 0 ? undefined : inviteGroup.id}
          groups={groups}
          onClose={() => setInviteGroup(null)} 
        />
      )}
      
      {selectedGroup && (
        <GroupDetailsModal 
          group={selectedGroup}
          currentUserId={user.id}
          onClose={() => setSelectedGroup(null)}
          onInviteMember={(groupId) => {
            const group = localGroups.find(g => g.id === groupId);
            if (group) {
              setInviteGroup(group);
              setSelectedGroup(null);
            }
          }}
          onDeleteGroup={(groupId) => {
            const group = localGroups.find(g => g.id === groupId);
            if (group) {
              setDeleteGroup(group);
              setSelectedGroup(null);
            }
          }}
        />
      )}
    </AppLayout>
  );
}
