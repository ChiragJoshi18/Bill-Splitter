import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './button';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close>
              <X className="w-5 h-5 text-gray-500" />
            </Dialog.Close>
          </div>
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">{description}</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
