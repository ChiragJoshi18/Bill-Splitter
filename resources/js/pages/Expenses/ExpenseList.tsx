import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Receipt, 
    Plus,
    Calendar,
    User,
    Users
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Expense {
  id: number;
  title: string;
  description: string | null;
  total_amount: number;
  expense_date: string;
  category: string;
  created_at: string;
  group: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    name: string;
  };
  user_share: number;
  user_paid: number;
  user_balance: number;
  is_creator: boolean;
}

interface Props {
  expenses: Expense[];
  user: {
    id: number;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Expenses',
    href: '/expenses',
  },
];

export default function ExpenseList({ expenses, user }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      <Head title="Expenses" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground mt-1">
              View all expenses from your groups
            </p>
          </div>
          <Button asChild>
            <a href="/expenses/create">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </a>
          </Button>
        </div>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Your Expenses ({expenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                <p className="text-muted-foreground">
                  When you add expenses to your groups, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{expense.title}</h3>
                          <span className="text-sm text-muted-foreground capitalize">
                            {expense.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {expense.group.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(expense.expense_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {expense.creator.name}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground mt-2">{expense.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold">
                          {formatAmount(expense.total_amount)}
                        </p>
                        {expense.user_balance !== 0 && (
                          <div className={`text-sm font-medium ${expense.user_balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {expense.user_balance > 0 ? '+' : ''}{formatAmount(expense.user_balance)}
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