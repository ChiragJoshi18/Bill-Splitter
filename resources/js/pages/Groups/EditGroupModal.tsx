import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  group: {
    id: number;
    name: string;
    description: string | null;
  };
  onClose: () => void;
  onGroupUpdated?: (groupId: number, updatedData: any) => void;
}

export default function EditGroupModal({ group, onClose, onGroupUpdated }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    name: group.name,
    description: group.description || '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    patch(`/groups/${group.id}`, {
      onSuccess: () => {
        onClose();
        // Call the callback to update the local state
        if (onGroupUpdated) {
          onGroupUpdated(group.id, { name: data.name, description: data.description });
        }
      },
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
              Group Name
            </label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              disabled={processing}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
              Description
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border px-3 py-2 bg-background"
              disabled={processing}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
