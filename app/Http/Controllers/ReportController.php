<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\Expense;
use App\Models\Settlement;
use App\Models\Invitation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user's groups
        $groups = Group::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['users', 'expenses'])->get();

        // Personal Financial Summary
        $personalSummary = $this->getPersonalFinancialSummary($user);
        
        // Recent Activity
        $recentActivity = $this->getRecentActivity($user);
        
        // Spending Trends (last 6 months)
        $spendingTrends = $this->getSpendingTrends($user);
        
        // Category Breakdown
        $categoryBreakdown = $this->getCategoryBreakdown($user);
        
        // Settlement Summary
        $settlementSummary = $this->getSettlementSummary($user);

        return Inertia::render('Reports/ReportDashboard', [
            'groups' => $groups,
            'personalSummary' => $personalSummary,
            'recentActivity' => $recentActivity,
            'spendingTrends' => $spendingTrends,
            'categoryBreakdown' => $categoryBreakdown,
            'settlementSummary' => $settlementSummary,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    public function groupReport($groupId)
    {
        $user = Auth::user();
        $group = Group::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with(['users', 'expenses.creator', 'expenses.participants', 'expenses.payers'])->findOrFail($groupId);

        // Group Balance Report
        $groupBalance = $this->calculateGroupBalance($group);
        
        // Group Expense History
        $expenseHistory = $this->getGroupExpenseHistory($group);
        
        // Member Contribution Analysis
        $memberContributions = $this->getMemberContributions($group);
        
        // Category Breakdown for this group
        $groupCategoryBreakdown = $this->getGroupCategoryBreakdown($group);

        return Inertia::render('Reports/GroupReport', [
            'group' => $group,
            'groupBalance' => $groupBalance,
            'expenseHistory' => $expenseHistory,
            'memberContributions' => $memberContributions,
            'groupCategoryBreakdown' => $groupCategoryBreakdown,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    public function exportReport(Request $request)
    {
        $user = Auth::user();
        $type = $request->get('type', 'personal'); // personal, group, settlement
        $groupId = $request->get('group_id');
        $dateRange = $request->get('date_range', 'month'); // week, month, quarter, year

        $data = [];
        
        switch ($type) {
            case 'personal':
                $data = $this->getPersonalFinancialSummary($user, $dateRange);
                break;
            case 'group':
                if ($groupId) {
                    $group = Group::findOrFail($groupId);
                    $data = $this->calculateGroupBalance($group, $dateRange);
                }
                break;
            case 'settlement':
                $data = $this->getSettlementSummary($user, $dateRange);
                break;
        }

        return response()->json([
            'data' => $data,
            'exported_at' => now()->toISOString(),
            'user' => $user->name,
        ]);
    }

    private function getPersonalFinancialSummary($user, $dateRange = 'month')
    {
        $startDate = $this->getStartDate($dateRange);
        
        // Get all groups where user is a member
        $groups = Group::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        $summary = [];
        $totalOwed = 0;
        $totalOwedTo = 0;

        foreach ($groups as $group) {
            $balance = $this->calculateUserBalanceInGroup($user, $group, $startDate);
            
            $summary[] = [
                'group_id' => $group->id,
                'group_name' => $group->name,
                'you_owe' => max(0, -$balance),
                'owed_to_you' => max(0, $balance),
                'net_balance' => $balance,
            ];

            $totalOwed += max(0, -$balance);
            $totalOwedTo += max(0, $balance);
        }

        return [
            'groups' => $summary,
            'total_owed' => $totalOwed,
            'total_owed_to_you' => $totalOwedTo,
            'net_position' => $totalOwedTo - $totalOwed,
            'date_range' => $dateRange,
        ];
    }

    private function getRecentActivity($user, $limit = 10)
    {
        $activities = collect();

        // Recent expenses
        $recentExpenses = Expense::whereHas('group.users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['group:id,name', 'creator:id,name'])
        ->orderBy('created_at', 'desc')
        ->limit($limit / 2)
        ->get()
        ->map(function ($expense) {
            return [
                'id' => 'expense_' . $expense->id,
                'type' => 'expense',
                'title' => $expense->title,
                'amount' => $expense->total_amount,
                'group_name' => $expense->group->name,
                'creator_name' => $expense->creator->name,
                'created_at' => $expense->created_at,
                'description' => $expense->creator->name . ' added "' . $expense->title . '" to ' . $expense->group->name,
            ];
        });

        // Recent settlements
        $recentSettlements = Settlement::where(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
        })
        ->with(['group:id,name', 'fromUser:id,name', 'toUser:id,name'])
        ->orderBy('created_at', 'desc')
        ->limit($limit / 2)
        ->get()
        ->map(function ($settlement) use ($user) {
            $isFromUser = $settlement->from_user_id === $user->id;
            return [
                'id' => 'settlement_' . $settlement->id,
                'type' => 'settlement',
                'title' => 'Settlement',
                'amount' => $settlement->amount,
                'group_name' => $settlement->group->name,
                'status' => $settlement->status,
                'created_at' => $settlement->created_at,
                'description' => $isFromUser 
                    ? 'You sent ₹' . $settlement->amount . ' to ' . $settlement->toUser->name
                    : $settlement->fromUser->name . ' sent you ₹' . $settlement->amount,
            ];
        });

        return $activities->merge($recentExpenses)->merge($recentSettlements)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();
    }

    private function getSpendingTrends($user, $months = 6)
    {
        $trends = [];
        $startDate = now()->subMonths($months);

        for ($i = 0; $i < $months; $i++) {
            $monthStart = $startDate->copy()->addMonths($i)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();

            $monthlyExpenses = Expense::whereHas('group.users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->sum('total_amount');

            $trends[] = [
                'month' => $monthStart->format('M Y'),
                'amount' => $monthlyExpenses,
                'date' => $monthStart->format('Y-m'),
            ];
        }

        return $trends;
    }

    private function getCategoryBreakdown($user, $dateRange = 'month')
    {
        $startDate = $this->getStartDate($dateRange);

        return Expense::whereHas('group.users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('created_at', '>=', $startDate)
        ->select('category', DB::raw('SUM(total_amount) as total_amount'), DB::raw('COUNT(*) as count'))
        ->groupBy('category')
        ->orderBy('total_amount', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'category' => $item->category,
                'amount' => $item->total_amount,
                'count' => $item->count,
                'percentage' => 0, // Will be calculated on frontend
            ];
        });
    }

    private function getSettlementSummary($user, $dateRange = 'month')
    {
        $startDate = $this->getStartDate($dateRange);

        $settlements = Settlement::where(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
        })
        ->where('created_at', '>=', $startDate)
        ->get();

        $summary = [
            'pending' => ['count' => 0, 'amount' => 0],
            'completed' => ['count' => 0, 'amount' => 0],
            'rejected' => ['count' => 0, 'amount' => 0],
        ];

        foreach ($settlements as $settlement) {
            $status = $settlement->status;
            $summary[$status]['count']++;
            $summary[$status]['amount'] += $settlement->amount;
        }

        // Calculate percentages
        $totalCount = array_sum(array_column($summary, 'count'));
        $totalAmount = array_sum(array_column($summary, 'amount'));

        foreach ($summary as $status => $data) {
            $summary[$status]['percentage'] = $totalCount > 0 ? round(($data['count'] / $totalCount) * 100, 1) : 0;
        }

        return $summary;
    }

    private function calculateGroupBalance($group, $dateRange = 'month')
    {
        $startDate = $this->getStartDate($dateRange);
        $balances = [];

        foreach ($group->users as $member) {
            $balance = $this->calculateUserBalanceInGroup($member, $group, $startDate);
            
            $balances[] = [
                'user_id' => $member->id,
                'user_name' => $member->name,
                'total_paid' => $this->getUserTotalPaid($member, $group, $startDate),
                'total_share' => $this->getUserTotalShare($member, $group, $startDate),
                'balance' => $balance,
                'is_you' => $member->id === Auth::id(),
            ];
        }

        return $balances;
    }

    private function getGroupExpenseHistory($group, $limit = 20)
    {
        return $group->expenses()
            ->with(['creator:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'title' => $expense->title,
                    'amount' => $expense->total_amount,
                    'category' => $expense->category,
                    'creator_name' => $expense->creator->name,
                    'created_at' => $expense->created_at,
                ];
            });
    }

    private function getMemberContributions($group)
    {
        $contributions = [];

        foreach ($group->users as $member) {
            $totalPaid = $this->getUserTotalPaid($member, $group);
            $totalExpenses = $group->expenses()->sum('total_amount');
            $percentage = $totalExpenses > 0 ? round(($totalPaid / $totalExpenses) * 100, 1) : 0;

            $contributions[] = [
                'user_id' => $member->id,
                'user_name' => $member->name,
                'total_paid' => $totalPaid,
                'percentage' => $percentage,
                'is_you' => $member->id === Auth::id(),
            ];
        }

        return collect($contributions)->sortByDesc('total_paid')->values();
    }

    private function getGroupCategoryBreakdown($group)
    {
        return $group->expenses()
            ->select('category', DB::raw('SUM(total_amount) as total_amount'), DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->orderBy('total_amount', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'amount' => $item->total_amount,
                    'count' => $item->count,
                ];
            });
    }

    private function calculateUserBalanceInGroup($user, $group, $startDate = null)
    {
        $query = $group->expenses();
        
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        $expenses = $query->with(['participants', 'payers'])->get();

        $totalPaid = 0;
        $totalShare = 0;

        foreach ($expenses as $expense) {
            // Calculate what user paid
            $userPaid = $expense->payers()->where('user_id', $user->id)->sum('amount_paid');
            $totalPaid += $userPaid;

            // Calculate what user owes
            $userShare = $expense->participants()->where('user_id', $user->id)->sum('share_amount');
            $totalShare += $userShare;
        }

        return $totalPaid - $totalShare;
    }

    private function getUserTotalPaid($user, $group, $startDate = null)
    {
        $query = $group->expenses();
        
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        return $query->join('expense_user', 'expenses.id', '=', 'expense_user.expense_id')
            ->where('expense_user.user_id', $user->id)
            ->where('expense_user.role', 'payer')
            ->sum('expense_user.amount_paid');
    }

    private function getUserTotalShare($user, $group, $startDate = null)
    {
        $query = $group->expenses();
        
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        return $query->join('expense_user', 'expenses.id', '=', 'expense_user.expense_id')
            ->where('expense_user.user_id', $user->id)
            ->where('expense_user.role', 'participant')
            ->sum('expense_user.share_amount');
    }

    private function getStartDate($dateRange)
    {
        switch ($dateRange) {
            case 'week':
                return now()->subWeek();
            case 'month':
                return now()->subMonth();
            case 'quarter':
                return now()->subQuarter();
            case 'year':
                return now()->subYear();
            default:
                return now()->subMonth();
        }
    }
} 