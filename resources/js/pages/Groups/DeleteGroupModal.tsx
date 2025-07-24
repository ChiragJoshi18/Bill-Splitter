import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';

interface Props {
  group: {
    id: number;
    name: string;
  };
  onClose: () => void;
}

export default function DeleteGroupModal({ group, onClose }: Props) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    destroy(`/groups/${group.id}`, {
      onSuccess: () => onClose(),
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
