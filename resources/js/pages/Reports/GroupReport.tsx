import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Receipt, 
    CreditCard, 
    TrendingUp, 
    TrendingDown,
    ArrowLeft,
    Download,
    PieChart,
    BarChart3,
    Calendar
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface GroupBalance {
    user_id: number;
    user_name: string;
    total_paid: number;
    total_share: number;
    balance: number;
    is_you: boolean;
}

interface ExpenseHistory {
    id: number;
    title: string;
    amount: number;
    category: string;
    creator_name: string;
    created_at: string;
}

interface MemberContribution {
    user_id: number;
    user_name: string;
    total_paid: number;
    percentage: number;
    is_you: boolean;
}

interface CategoryBreakdown {
    category: string;
    amount: number;
    count: number;
}

interface Props {
    group: {
        id: number;
        name: string;
        description: string | null;
        created_at: string;
        users: Array<{
            id: number;
            name: string;
        }>;
    };
    groupBalance: GroupBalance[];
    expenseHistory: ExpenseHistory[];
    memberContributions: MemberContribution[];
    groupCategoryBreakdown: CategoryBreakdown[];
    user: {
        id: number;
        name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'Group Report',
        href: '#',
    },
];

export default function GroupReport({ 
    group, 
    groupBalance, 
    expenseHistory, 
    memberContributions, 
    groupCategoryBreakdown,
    user 
}: Props) {
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

    const getBalanceColor = (balance: number) => {
        if (balance > 0) return 'text-green-600';
        if (balance < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getBalanceIcon = (balance: number) => {
        if (balance > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (balance < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return null;
    };

    const totalExpenses = expenseHistory.reduce((sum, expense) => sum + expense.amount, 0);
    const totalMembers = group.users.length;
    const averageExpense = totalExpenses / Math.max(1, expenseHistory.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${group.name} - Group Report`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
                            <p className="text-muted-foreground mt-1">
                                Group financial report and analytics
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Group Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <Receipt className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatAmount(totalExpenses)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {expenseHistory.length} expenses
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Members</CardTitle>
                            <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {totalMembers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active members
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
                            <BarChart3 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatAmount(averageExpense)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Per expense
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Created</CardTitle>
                            <Calendar className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatDate(group.created_at)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Group creation date
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Group Balance Report */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Group Balance Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {groupBalance.map((member) => (
                                        <div key={member.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 border rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium">
                                                        {member.user_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {member.is_you ? 'You' : member.user_name}
                                                        </span>
                                                        {member.is_you && (
                                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                                                You
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Paid: {formatAmount(member.total_paid)} | Share: {formatAmount(member.total_share)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center gap-1 font-medium ${getBalanceColor(member.balance)}`}>
                                                    {getBalanceIcon(member.balance)}
                                                    {formatAmount(Math.abs(member.balance))}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {member.balance > 0 ? 'Owed to' : member.balance < 0 ? 'Owes' : 'Settled'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Member Contributions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Member Contributions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {memberContributions.map((member, index) => (
                                        <div key={member.user_id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {member.is_you ? 'You' : member.user_name}
                                                    </span>
                                                    {member.is_you && (
                                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">
                                                        {formatAmount(member.total_paid)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {member.percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${member.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Category Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5" />
                                    Category Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {groupCategoryBreakdown.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ 
                                                        backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                                                    }}
                                                />
                                                <span className="text-sm font-medium capitalize">
                                                    {category.category}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">
                                                    {formatAmount(category.amount)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {category.count} expenses
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Expenses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="w-5 h-5" />
                                    Recent Expenses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {expenseHistory.slice(0, 5).map((expense) => (
                                        <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {expense.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {expense.creator_name} • {formatDate(expense.created_at)}
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-sm font-medium">
                                                    {formatAmount(expense.amount)}
                                                </div>
                                                <Badge className="text-xs capitalize">
                                                    {expense.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {expenseHistory.length > 5 && (
                                    <div className="mt-4 pt-3 border-t">
                                        <Button variant="ghost" size="sm" className="w-full">
                                            View All Expenses
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 