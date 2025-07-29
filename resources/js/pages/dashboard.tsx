import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import EditGroupModal from './Groups/EditGroupModal';
import DeleteGroupModal from './Groups/DeleteGroupModal';
import FinancialSummaryCards from '@/components/financial-summary-cards';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Receipt, 
  CreditCard, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  users: User[];
}

interface Props {
  groups: Group[];
  auth: {
    user: {
      id: number;
    };
  };
  financialSummary: {
    amountToPay: number;
    amountToReceive: number;
    totalExpenses: number;
    currencySymbol: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ groups, auth, financialSummary }: Props) {
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getNetPosition = () => {
    return financialSummary.amountToReceive - financialSummary.amountToPay;
  };

  const getNetPositionColor = () => {
    const net = getNetPosition();
    if (net > 0) return 'text-green-600';
    if (net < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getNetPositionIcon = () => {
    const net = getNetPosition();
    if (net > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (net < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <DollarSign className="w-4 h-4 text-gray-500" />;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">

        {/* Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your financial overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/groups/create">
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/expenses/create">
                <Receipt className="w-4 h-4 mr-2" />
                Add Expense
              </Link>
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <FinancialSummaryCards
          amountToPay={financialSummary.amountToPay}
          amountToReceive={financialSummary.amountToReceive}
          totalExpenses={financialSummary.totalExpenses}
          currencySymbol={financialSummary.currencySymbol}
        />

        {/* Net Position Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Your Net Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getNetPositionIcon()}
                <div>
                  <div className={`text-2xl font-bold ${getNetPositionColor()}`}>
                    {formatAmount(Math.abs(getNetPosition()))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getNetPosition() > 0 ? 'Net positive' : getNetPosition() < 0 ? 'Net negative' : 'All settled'}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/settlements">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Settlements
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Groups ({groups.length})
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/groups">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {groups.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first group to start splitting expenses with friends and family.
                    </p>
                    <Button asChild>
                      <Link href="/groups/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.slice(0, 4).map((group) => (
                      <div
                        key={group.id}
                        className="rounded-lg border p-4 shadow-sm bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold truncate">{group.name}</h3>
                          {group.created_by === auth.user.id && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditGroup(group)}
                                className="text-yellow-500 hover:text-yellow-600 p-1 rounded"
                                title="Edit group"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteGroup(group)}
                                className="text-red-500 hover:text-red-600 p-1 rounded"
                                title="Delete group"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {group.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {group.description}
                          </p>
                        )}

                        {/* Members */}
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-2">Members ({group.users.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {group.users.slice(0, 3).map((user) => (
                              <span
                                key={user.id}
                                className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white"
                              >
                                {user.id === auth.user.id ? 'You' : user.name}
                              </span>
                            ))}
                            {group.users.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                +{group.users.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm" className="flex-1">
                            <Link href={`/expenses/create?group=${group.id}`}>
                              <Receipt className="w-4 h-4 mr-1" />
                              Add Expense
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="flex-1">
                            <Link href={`/reports/group/${group.id}`}>
                              <Activity className="w-4 h-4 mr-1" />
                              View Report
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Groups</span>
                  <Badge variant="secondary">{groups.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Expenses</span>
                  <Badge variant="secondary">
                    {formatAmount(financialSummary.totalExpenses)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Settlements</span>
                  <Badge variant="outline" className="text-yellow-600">
                    {financialSummary.amountToPay > 0 ? '₹' + Math.round(financialSummary.amountToPay) : 'None'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/expenses/create">
                    <Receipt className="w-4 h-4 mr-2" />
                    Add New Expense
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/settlements/create">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Create Settlement
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/groups/create">
                    <Users className="w-4 h-4 mr-2" />
                    Create New Group
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/reports">
                    <Activity className="w-4 h-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No recent activity yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start adding expenses to see activity here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {editGroup && (
        <EditGroupModal group={editGroup} onClose={() => setEditGroup(null)} />
      )}
      {deleteGroup && (
        <DeleteGroupModal group={deleteGroup} onClose={() => setDeleteGroup(null)} />
      )}
    </AppLayout>
  );
}
