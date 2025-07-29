import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { 
  Users, 
  Receipt, 
  Calendar, 
  UserPlus, 
  Trash2, 
  X,
  Plus,
  DollarSign
} from 'lucide-react';

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
  group: Group | null;
  onClose: () => void;
  currentUserId: number;
  onInviteMember?: (groupId: number) => void;
  onDeleteGroup?: (groupId: number) => void;
}

export default function GroupDetailsModal({ group, onClose, currentUserId, onInviteMember, onDeleteGroup }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    name: group?.name || '',
    description: group?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      patch(`/groups/${group.id}`, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  if (!group) return null;

  const isCreator = group.created_by === currentUserId;

  return (
    <Dialog open={!!group} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[70vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Group Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info Section */}
          <div>
            <h3 className="text-base font-semibold mb-2">Group Information</h3>
            
            {isCreator ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Enter group name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Enter group description"
                    rows={2}
                    className="w-full rounded-md border px-3 py-2 bg-background text-sm"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-sm">
                  <span className="font-medium">Name:</span> {group.name}
                </div>
                {group.description && (
                  <div className="text-sm">
                    <span className="font-medium">Description:</span> {group.description}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(group.created_at)}
                </div>
              </div>
            )}
          </div>



          {/* Members Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">Members</h3>
              {isCreator && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onInviteMember?.(group.id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              )}
            </div>
            
            <div className="space-y-1.5">
              {group.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {user.id === currentUserId ? 'You' : user.name}
                    </span>
                    {group.created_by === user.id && (
                      <span className="px-1.5 py-0.5 border text-xs rounded-full text-xs">
                        Creator
                      </span>
                    )}
                  </div>
                  
                  {isCreator && user.id !== currentUserId && (
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 h-6 w-6 p-0">
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {isCreator && (
            <div className="border-t pt-3">
              <h3 className="text-base font-semibold mb-2">Quick Actions</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Expense
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <DollarSign className="w-3 h-3 mr-1" />
                  View Settlements
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => onDeleteGroup?.(group.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Group
                </Button>
              </div>
              
              {/* Save Changes Button */}
              <form onSubmit={handleSubmit} className="mt-3">
                <Button type="submit" disabled={processing} className="w-full">
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 