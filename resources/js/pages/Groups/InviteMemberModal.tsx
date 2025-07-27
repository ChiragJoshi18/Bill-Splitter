import { Dialog } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  groupId?: number;
  groups: { id: number; name: string }[];
}

export default function InviteMemberModal({ open, onClose, groupId, groups }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    group_id: groupId ?? '',
  });

  useEffect(() => {
    setData('group_id', groupId ?? '');
  }, [groupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('groups.invite.send'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-neutral-900">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Invite Member</Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 dark:bg-neutral-800 dark:text-white"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Group</label>
              <select
                className="w-full rounded-md border px-3 py-2 dark:bg-neutral-800 dark:text-white"
                value={data.group_id}
                onChange={(e) => setData('group_id', Number(e.target.value))}
                required
              >
                <option value="">-- Select Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.group_id && <p className="text-red-500 text-sm mt-1">{errors.group_id}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
              >
                {processing ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
