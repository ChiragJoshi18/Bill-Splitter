import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CreditCard, 
    Users, 
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle,
    XCircle,
    Clock,
    Plus
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Settlement {
  id: number;
  group: {
    id: number;
    name: string;
  };
  from_user: {
    id: number;
    name: string;
  };
  to_user: {
    id: number;
    name: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  is_from_me: boolean;
  is_to_me: boolean;
}

interface GroupBalance {
  user_id: number;
  name: string;
  total_paid: number;
  total_share: number;
  balance: number;
}

interface Props {
  settlements: Settlement[];
  groupBalances: { [key: number]: GroupBalance[] };
  summary: {
    to_pay: number;
    to_receive: number;
    net_balance: number;
  };
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
];

export default function SettlementList({ settlements, groupBalances, summary, user }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const updateSettlementStatus = (settlementId: number, status: 'completed' | 'rejected') => {
    router.patch(`/settlements/${settlementId}/status`, {
      status: status,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Settlements" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settlements</h1>
            <p className="text-muted-foreground mt-1">
              Manage payments and balances across your groups
            </p>
          </div>
          <Button asChild>
            <a href="/settlements/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Settlement
            </a>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">You owe</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatAmount(summary.to_pay)}
                  </p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">You are owed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(summary.to_receive)}
                  </p>
                </div>
                <ArrowDownLeft className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net balance</p>
                  <p className={`text-2xl font-bold ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summary.net_balance >= 0 ? '+' : ''}{formatAmount(summary.net_balance)}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Group Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(groupBalances).length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No group balances to show</h3>
                <p className="text-muted-foreground">
                  When you have multiple members in your groups with shared expenses, balances will appear here.
                </p>
              </div>
            ) : (
              Object.entries(groupBalances).map(([groupId, balances]) => {
                const group = balances[0] ? settlements.find(s => s.group.id.toString() === groupId)?.group : null;
                if (!group || balances.length === 0) return null;

                return (
                  <div key={groupId} className="mb-6 last:mb-0">
                    <h3 className="font-semibold text-lg mb-3">{group?.name}</h3>
                    <div className="space-y-3">
                      {balances.map((balance) => (
                        <div key={balance.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {balance.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{balance.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Paid: {formatAmount(balance.total_paid)} | Share: {formatAmount(balance.total_share)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {balance.balance >= 0 ? '+' : ''}{formatAmount(balance.balance)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {balance.balance >= 0 ? 'Gets back' : 'Owes'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Settlements List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Settlement History ({settlements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {settlements.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No settlements yet</h3>
                <p className="text-muted-foreground">
                  When you create or receive settlements, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {settlements.map((settlement) => (
                  <div key={settlement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {settlement.is_from_me ? 'You' : settlement.from_user.name} → {settlement.is_to_me ? 'You' : settlement.to_user.name}
                          </h3>
                          {getStatusBadge(settlement.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {settlement.group.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(settlement.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold">
                          {formatAmount(settlement.amount)}
                        </p>
                        {settlement.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => updateSettlementStatus(settlement.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSettlementStatus(settlement.id, 'rejected')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 