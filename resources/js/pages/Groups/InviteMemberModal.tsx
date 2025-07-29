import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Mail, UserPlus } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('groups.invite.send'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const selectedGroup = groups.find(g => g.id === data.group_id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Member
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedGroup && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Inviting to: <strong>{selectedGroup.name}</strong>
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {!groupId && (
            <div>
              <Label htmlFor="group">Select Group *</Label>
              <select
                id="group"
                className="w-full rounded-md border px-3 py-2 bg-background"
                value={data.group_id}
                onChange={(e) => setData('group_id', Number(e.target.value))}
                required
              >
                <option value="">-- Select a group to invite to --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.group_id && <p className="text-red-500 text-sm mt-1">{errors.group_id}</p>}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>• The user will receive an email invitation to join the group</p>
            <p>• They can accept the invitation by clicking the link in the email</p>
            <p>• If they don't have an account, they'll be prompted to create one</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing || !data.group_id} className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {processing ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
