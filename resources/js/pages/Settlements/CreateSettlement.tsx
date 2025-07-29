import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { 
    CreditCard, 
    Users, 
    ArrowLeft,
    User
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Group {
  id: number;
  name: string;
  members: {
    id: number;
    name: string;
  }[];
}

interface Props {
  groups: Group[];
  user: {
    id: number;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settlements',
    href: '/settlements',
  },
  {
    title: 'Create Settlement',
    href: '/settlements/create',
  },
];

export default function CreateSettlement({ groups, user }: Props) {
  const { addToast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    group_id: '',
    to_user_id: '',
    amount: '',
  });

  const handleGroupChange = (groupId: string) => {
    const group = groups.find(g => g.id.toString() === groupId);
    setSelectedGroup(group || null);
    setData('group_id', groupId);
    setData('to_user_id', ''); // Reset user selection when group changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/settlements', {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Settlement created successfully!',
          message: 'Your settlement has been created and sent.'
        });
        // The page will redirect to settlements list, which will show the new settlement
      },
      onError: (errors) => {
        addToast({
          type: 'error',
          title: 'Failed to create settlement',
          message: Object.values(errors).join(', ')
        });
      }
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Settlement" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Settlement</h1>
            <p className="text-muted-foreground mt-1">
              Create a new settlement to pay someone back
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Settlement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Settlement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="group_id">Group</Label>
                  <Select value={data.group_id} onValueChange={handleGroupChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.group_id && <p className="text-red-500 text-sm mt-1">{errors.group_id}</p>}
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={data.amount}
                    onChange={(e) => setData('amount', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </div>

              {selectedGroup && (
                <div>
                  <Label htmlFor="to_user_id">Pay to</Label>
                  {selectedGroup.members.filter(member => member.id !== user.id).length === 0 ? (
                    <div className="p-4 border rounded-lg bg-yellow-50/50">
                      <p className="text-sm text-yellow-700">
                        No other members in this group. You need to invite more people to create settlements.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Select value={data.to_user_id} onValueChange={(value) => setData('to_user_id', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedGroup.members
                            .filter(member => member.id !== user.id) // Don't show current user
                            .map((member) => (
                              <SelectItem key={member.id} value={member.id.toString()}>
                                {member.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.to_user_id && <p className="text-red-500 text-sm mt-1">{errors.to_user_id}</p>}
                    </>
                  )}
                </div>
              )}

              {selectedGroup && data.to_user_id && data.amount && (
                <div className="p-4 border rounded-lg bg-blue-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Settlement Summary</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    You will pay{' '}
                    <span className="font-semibold">
                      {formatAmount(parseFloat(data.amount) || 0)}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold">
                      {selectedGroup.members.find(m => m.id.toString() === data.to_user_id)?.name}
                    </span>{' '}
                    in the group{' '}
                    <span className="font-semibold">{selectedGroup.name}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                processing || 
                !data.group_id || 
                !data.to_user_id || 
                !data.amount ||
                (selectedGroup ? selectedGroup.members.filter(member => member.id !== user.id).length === 0 : false)
              }
            >
              {processing ? 'Creating...' : 'Create Settlement'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
} 