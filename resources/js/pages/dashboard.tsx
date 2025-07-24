import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CreateGroupModal from './Groups/CreateGroupModal';
import EditGroupModal from './Groups/EditGroupModal';
import DeleteGroupModal from './Groups/DeleteGroupModal';
import { Pencil, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  users: User[];
}

interface Props {
  groups: Group[];
  auth: {
    user: {
      id: number;
    };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ groups, auth }: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            + Create Group
          </button>
        </div>

        {/* Top 3 Placeholder Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
            >
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
          ))}
        </div>

        {/* Group Cards */}
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 md:min-h-min dark:border-sidebar-border bg-white dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
          {groups.length === 0 ? (
            <p className="text-gray-500">No groups yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-lg border p-4 shadow-sm bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    {group.created_by === auth.user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditGroup(group)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteGroup(group)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {group.description}
                    </p>
                  )}

                  {/* Members */}
                  <div>
                    <p className="text-sm font-medium mb-1">Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {group.users.map((user) => (
                        <span
                          key={user.id}
                          className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white"
                        >
                          {user.id === auth.user.id ? 'You' : user.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateGroupModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      {editGroup && (
        <EditGroupModal group={editGroup} onClose={() => setEditGroup(null)} />
      )}
      {deleteGroup && (
        <DeleteGroupModal group={deleteGroup} onClose={() => setDeleteGroup(null)} />
      )}
    </AppLayout>
  );
}
