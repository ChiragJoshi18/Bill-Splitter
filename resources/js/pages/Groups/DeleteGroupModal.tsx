import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';

interface Props {
  group: {
    id: number;
    name: string;
  };
  onClose: () => void;
  onGroupDeleted?: (groupId: number) => void;
}

export default function DeleteGroupModal({ group, onClose, onGroupDeleted }: Props) {
  const { addToast } = useToast();
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    destroy(`/groups/${group.id}`, {
      onSuccess: () => {
        onClose();
        addToast({
          type: 'success',
          title: 'Group deleted successfully!',
          message: `The group "${group.name}" has been deleted.`
        });
        // Call the callback to update the local state
        if (onGroupDeleted) {
          onGroupDeleted(group.id);
        }
      },
      onError: (errors) => {
        addToast({
          type: 'error',
          title: 'Failed to delete group',
          message: Object.values(errors).join(', ')
        });
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the group <strong>{group.name}</strong>? This action cannot be undone.
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={processing}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
