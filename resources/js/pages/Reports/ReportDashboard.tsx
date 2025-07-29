import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    PieChart as PieChartIcon, 
    BarChart3, 
    TrendingUp, 
    Users, 
    CreditCard, 
    Receipt,
    Download,
    Calendar,
    ArrowRight,
    TrendingDown,
    DollarSign
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { BarChart, LineChart, DonutChart } from '@/components/ui/chart';

interface PersonalSummary {
    groups: Array<{
        group_id: number;
        group_name: string;
        you_owe: number;
        owed_to_you: number;
        net_balance: number;
    }>;
    total_owed: number;
    total_owed_to_you: number;
    net_position: number;
    date_range: string;
}

interface RecentActivity {
    id: string;
    type: 'expense' | 'settlement';
    title: string;
    amount: number;
    group_name: string;
    creator_name?: string;
    status?: string;
    created_at: string;
    description: string;
}

interface SpendingTrend {
    month: string;
    amount: number;
    date: string;
}

interface CategoryBreakdown {
    category: string;
    amount: number;
    count: number;
    percentage: number;
}

interface SettlementSummary {
    pending: { count: number; amount: number; percentage: number };
    completed: { count: number; amount: number; percentage: number };
    rejected: { count: number; amount: number; percentage: number };
}

interface Props {
    groups: any[];
    personalSummary: PersonalSummary;
    recentActivity: RecentActivity[];
    spendingTrends: SpendingTrend[];
    categoryBreakdown: CategoryBreakdown[];
    settlementSummary: SettlementSummary;
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
];

export default function ReportDashboard({ 
    groups, 
    personalSummary, 
    recentActivity, 
    spendingTrends, 
    categoryBreakdown, 
    settlementSummary,
    user 
}: Props) {
    const [dateRange, setDateRange] = useState('month');

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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'expense':
                return <Receipt className="w-4 h-4" />;
            case 'settlement':
                return <CreditCard className="w-4 h-4" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    // Prepare chart data
    const spendingTrendsData = spendingTrends.map(trend => ({
        label: trend.month,
        value: trend.amount
    }));

    const categoryBreakdownData = categoryBreakdown.map(category => ({
        label: category.category,
        value: category.amount
    }));

    const settlementData = [
        { label: 'Completed', value: settlementSummary.completed.amount, color: '#10b981' },
        { label: 'Pending', value: settlementSummary.pending.amount, color: '#f59e0b' },
        { label: 'Rejected', value: settlementSummary.rejected.amount, color: '#ef4444' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground mt-1">
                            Comprehensive insights into your financial activities
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">This Quarter</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Personal Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">You Owe</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatAmount(personalSummary.total_owed)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across {personalSummary.groups.length} groups
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Owed to You</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatAmount(personalSummary.total_owed_to_you)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total amount you're owed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
                            <BarChart3 className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${personalSummary.net_position >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatAmount(Math.abs(personalSummary.net_position))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {personalSummary.net_position >= 0 ? 'Net positive' : 'Net negative'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                            <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {groups.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Groups you're part of
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Spending Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Spending Trends (Last 6 Months)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LineChart 
                                    data={spendingTrendsData} 
                                    height={200} 
                                    showValues={false}
                                />
                            </CardContent>
                        </Card>

                        {/* Category Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChartIcon className="w-5 h-5" />
                                    Category Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DonutChart 
                                        data={categoryBreakdownData} 
                                        height={200} 
                                        showValues={true}
                                    />
                                    <div className="space-y-3">
                                        {categoryBreakdown.map((category, index) => (
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
                                                        {category.percentage}% ({category.count} expenses)
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Activity & Details */}
                    <div className="space-y-6">
                        {/* Settlement Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Settlement Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DonutChart 
                                    data={settlementData} 
                                    height={150} 
                                    showValues={false}
                                />
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Pending</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                {settlementSummary.pending.count}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatAmount(settlementSummary.pending.amount)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Completed</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                {settlementSummary.completed.count}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatAmount(settlementSummary.completed.amount)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Rejected</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                {settlementSummary.rejected.count}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatAmount(settlementSummary.rejected.amount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentActivity.slice(0, 5).map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex-shrink-0 mt-1">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium">
                                                        {activity.title}
                                                    </span>
                                                    {activity.status && (
                                                        <Badge className={getStatusColor(activity.status)}>
                                                            {activity.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(activity.created_at)}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {formatAmount(activity.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t">
                                    <Button variant="ghost" size="sm" className="w-full">
                                        View All Activity
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Group Balances */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Group Balances
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {personalSummary.groups.slice(0, 3).map((group) => (
                                        <div key={group.group_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {group.group_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {group.net_balance >= 0 ? 'You are owed' : 'You owe'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${group.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatAmount(Math.abs(group.net_balance))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {personalSummary.groups.length > 3 && (
                                    <div className="mt-4 pt-3 border-t">
                                        <Button variant="ghost" size="sm" className="w-full">
                                            View All Groups
                                            <ArrowRight className="w-4 h-4 ml-2" />
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