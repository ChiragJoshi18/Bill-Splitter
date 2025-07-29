<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get expenses where user is a participant (either creator or participant)
        $expenses = Expense::where(function ($query) use ($user) {
            $query->where('created_by', $user->id)
                  ->orWhereHas('participants', function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })
        ->with([
            'group:id,name',
            'creator:id,name',
            'participants:id,name',
            'payers:id,name'
        ])
        ->orderBy('expense_date', 'desc')
        ->get()
        ->map(function ($expense) use ($user) {
            // Calculate user's share and paid amount
            $userShare = $expense->participants()
                ->where('user_id', $user->id)
                ->first()?->pivot->share_amount ?? 0;
                
            $userPaid = $expense->payers()
                ->where('user_id', $user->id)
                ->first()?->pivot->amount_paid ?? 0;
                
            $userBalance = $userPaid - $userShare;
            
            return [
                'id' => $expense->id,
                'title' => $expense->title,
                'description' => $expense->description,
                'total_amount' => $expense->total_amount,
                'expense_date' => $expense->expense_date,
                'category' => $expense->category,
                'created_at' => $expense->created_at,
                'group' => [
                    'id' => $expense->group->id,
                    'name' => $expense->group->name,
                ],
                'creator' => [
                    'id' => $expense->creator->id,
                    'name' => $expense->creator->name,
                ],
                'user_share' => $userShare,
                'user_paid' => $userPaid,
                'user_balance' => $userBalance,
                'is_creator' => $expense->created_by === $user->id,
            ];
        });

        return Inertia::render('Expenses/ExpenseList', [
            'expenses' => $expenses,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        
        // Get groups where user is the creator
        $groups = Group::where('created_by', $user->id)
            ->with('users:id,name')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'members' => $group->users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name,
                        ];
                    }),
                ];
            });

        return Inertia::render('Expenses/CreateExpense', [
            'groups' => $groups,
            'categories' => [
                'food' => 'Food',
                'transport' => 'Transport',
                'entertainment' => 'Entertainment',
                'shopping' => 'Shopping',
                'utilities' => 'Utilities',
                'rent' => 'Rent',
                'accommodation' => 'Accommodation',
                'general' => 'General',
                'movie' => 'Movie',
                'dining' => 'Dining',
                'groceries' => 'Groceries',
                'travel' => 'Travel',
                'health' => 'Health',
                'education' => 'Education',
                'sports' => 'Sports',
                'beauty' => 'Beauty',
                'gifts' => 'Gifts',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'category' => 'required|string|max:255',
            'participants' => 'required|array|min:1',
            'participants.*.user_id' => 'required|exists:users,id',
            'participants.*.share_amount' => 'required|numeric|min:0',
            'payers' => 'required|array|min:1',
            'payers.*.user_id' => 'required|exists:users,id',
            'payers.*.amount_paid' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        
        // Verify user is the creator of the group
        $group = Group::where('id', $request->group_id)
            ->where('created_by', $user->id)
            ->firstOrFail();

        // Verify total paid equals total amount
        $totalPaid = collect($request->payers)->sum('amount_paid');
        if (abs($totalPaid - $request->total_amount) > 0.01) {
            return back()->withErrors(['total_amount' => 'Total amount paid must equal the expense amount.']);
        }

        // Verify total shares equals total amount
        $totalShares = collect($request->participants)->sum('share_amount');
        if (abs($totalShares - $request->total_amount) > 0.01) {
            return back()->withErrors(['participants' => 'Total shares must equal the expense amount.']);
        }

        // Create the expense
        $expense = Expense::create([
            'created_by' => $user->id,
            'group_id' => $request->group_id,
            'title' => $request->title,
            'description' => $request->description,
            'total_amount' => $request->total_amount,
            'expense_date' => $request->expense_date,
            'category' => $request->category,
        ]);

        // Add participants
        foreach ($request->participants as $participant) {
            $expense->participants()->attach($participant['user_id'], [
                'share_amount' => $participant['share_amount'],
            ]);
        }

        // Add payers
        foreach ($request->payers as $payer) {
            $expense->payers()->attach($payer['user_id'], [
                'amount_paid' => $payer['amount_paid'],
            ]);
        }

        return redirect()->route('expenses.index')->with('success', 'Expense created successfully!');
    }
} 