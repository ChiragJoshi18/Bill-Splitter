import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Receipt, 
    Users, 
    CreditCard,
    Plus,
    X,
    ArrowLeft
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

interface Participant {
  user_id: number;
  name: string;
  share_amount: number;
  percentage: number;
}

interface Payer {
  user_id: number;
  name: string;
  amount_paid: number;
}

interface Props {
  groups: Group[];
  categories: { [key: string]: string };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Expenses',
    href: '/expenses',
  },
  {
    title: 'Create Expense',
    href: '/expenses/create',
  },
];

export default function CreateExpense({ groups, categories }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [payers, setPayers] = useState<Payer[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'custom'>('equal');

  const { data, setData, post, processing, errors } = useForm({
    group_id: '',
    title: '',
    description: '',
    total_amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    category: '',
    participants: [] as any[],
    payers: [] as any[],
  });

  const handleGroupChange = (groupId: string) => {
    const group = groups.find(g => g.id.toString() === groupId);
    setSelectedGroup(group || null);
    setData('group_id', groupId);
    setParticipants([]);
    setPayers([]);
    
    // Add a default payer when group is selected
    if (group && group.members.length > 0) {
      const defaultPayer: Payer = {
        user_id: group.members[0].id,
        name: group.members[0].name,
        amount_paid: 0,
      };
      setPayers([defaultPayer]);
    }
  };

  const handleTotalAmountChange = (amount: string) => {
    setData('total_amount', amount);
    const numAmount = parseFloat(amount) || 0;
    
    if (splitType === 'equal' && selectedGroup) {
      const equalShare = numAmount / selectedGroup.members.length;
      const newParticipants = selectedGroup.members.map(member => ({
        user_id: member.id,
        name: member.name,
        share_amount: equalShare,
        percentage: 100 / selectedGroup.members.length,
      }));
      setParticipants(newParticipants);
    }
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: any) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    
    if (field === 'percentage') {
      const totalAmount = parseFloat(data.total_amount) || 0;
      newParticipants[index].share_amount = (totalAmount * value) / 100;
    } else if (field === 'share_amount') {
      const totalAmount = parseFloat(data.total_amount) || 0;
      newParticipants[index].percentage = totalAmount > 0 ? (value / totalAmount) * 100 : 0;
    }
    
    setParticipants(newParticipants);
  };

  const handlePayerChange = (index: number, field: keyof Payer, value: any) => {
    const newPayers = [...payers];
    newPayers[index] = { ...newPayers[index], [field]: value };
    setPayers(newPayers);
  };

  const addPayer = () => {
    if (selectedGroup) {
      const newPayer: Payer = {
        user_id: selectedGroup.members[0]?.id || 0,
        name: selectedGroup.members[0]?.name || '',
        amount_paid: 0,
      };
      setPayers([...payers, newPayer]);
    }
  };

  const removePayer = (index: number) => {
    setPayers(payers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form data with participants and payers
    setData('participants', participants.map(p => ({
      user_id: p.user_id,
      share_amount: p.share_amount,
    })));
    setData('payers', payers.map(p => ({
      user_id: p.user_id,
      amount_paid: p.amount_paid,
    })));
    
    post('/expenses');
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
      <Head title="Create Expense" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Expense</h1>
            <p className="text-muted-foreground mt-1">
              Add a new expense to your group
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Expense Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Expense Details
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter expense title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="total_amount">Total Amount</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    value={data.total_amount}
                    onChange={(e) => handleTotalAmountChange(e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.total_amount && <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>}
                </div>

                <div>
                  <Label htmlFor="expense_date">Date</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={data.expense_date}
                    onChange={(e) => setData('expense_date', e.target.value)}
                  />
                  {errors.expense_date && <p className="text-red-500 text-sm mt-1">{errors.expense_date}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Enter description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          {selectedGroup && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Expense Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label>Split Type:</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={splitType === 'equal'}
                        onCheckedChange={() => setSplitType('equal')}
                      />
                      Equal Split
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={splitType === 'percentage'}
                        onCheckedChange={() => setSplitType('percentage')}
                      />
                      Percentage Split
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={splitType === 'custom'}
                        onCheckedChange={() => setSplitType('custom')}
                      />
                      Custom Amount
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedGroup.members.map((member, index) => {
                    const participant = participants.find(p => p.user_id === member.id);
                    return (
                      <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {splitType === 'percentage' && (
                            <div className="w-24">
                              <Label className="text-xs text-muted-foreground mb-1 block">Percentage</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={participant?.percentage || 0}
                                onChange={(e) => handleParticipantChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                                placeholder="%"
                                className="text-sm"
                              />
                            </div>
                          )}
                          <div className="w-36">
                            <Label className="text-xs text-muted-foreground mb-1 block">Share Amount</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={participant?.share_amount || 0}
                              onChange={(e) => handleParticipantChange(index, 'share_amount', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Total Shares:</span>
                  <span className="font-bold">
                    {formatAmount(participants.reduce((sum, p) => sum + p.share_amount, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payers */}
          {selectedGroup && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Who Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={addPayer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payer
                </Button>

                <div className="space-y-3">
                  {payers.map((payer, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mb-1 block">Payer</Label>
                        <Select
                          value={payer.user_id.toString()}
                          onValueChange={(value) => {
                            const member = selectedGroup.members.find(m => m.id.toString() === value);
                            handlePayerChange(index, 'user_id', parseInt(value));
                            handlePayerChange(index, 'name', member?.name || '');
                          }}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select member" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedGroup.members.map((member) => (
                              <SelectItem key={member.id} value={member.id.toString()}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-36">
                        <Label className="text-xs text-muted-foreground mb-1 block">Amount Paid</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={payer.amount_paid}
                          onChange={(e) => handlePayerChange(index, 'amount_paid', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePayer(index)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Total Paid:</span>
                  <span className="font-bold">
                    {formatAmount(payers.reduce((sum, p) => sum + p.amount_paid, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create Expense'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
} 