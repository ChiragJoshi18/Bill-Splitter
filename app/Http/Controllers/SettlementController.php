<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Settlement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettlementController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get all groups where user is a member
        $groups = $user->groups()->with(['members', 'expenses'])->get();
        
        $settlements = collect();
        $groupBalances = collect();
        
        foreach ($groups as $group) {
            // Calculate balances for each group
            $balances = $this->calculateGroupBalances($group);
            $groupBalances->put($group->id, $balances);
            
            // Get settlements for this group
            $groupSettlements = Settlement::where('group_id', $group->id)
                ->where(function ($query) use ($user) {
                    $query->where('from_user_id', $user->id)
                          ->orWhere('to_user_id', $user->id);
                })
                ->with(['fromUser:id,name', 'toUser:id,name', 'group:id,name'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($settlement) use ($user) {
                    return [
                        'id' => $settlement->id,
                        'group' => [
                            'id' => $settlement->group->id,
                            'name' => $settlement->group->name,
                        ],
                        'from_user' => [
                            'id' => $settlement->fromUser->id,
                            'name' => $settlement->fromUser->name,
                        ],
                        'to_user' => [
                            'id' => $settlement->toUser->id,
                            'name' => $settlement->toUser->name,
                        ],
                        'amount' => $settlement->amount,
                        'status' => $settlement->status,
                        'created_at' => $settlement->created_at,
                        'is_from_me' => $settlement->from_user_id === $user->id,
                        'is_to_me' => $settlement->to_user_id === $user->id,
                    ];
                });
            
            $settlements = $settlements->merge($groupSettlements);
        }
        
        // Calculate overall summary
        $summary = $this->calculateOverallSummary($user);
        
        return Inertia::render('Settlements/SettlementList', [
            'settlements' => $settlements,
            'groupBalances' => $groupBalances,
            'summary' => $summary,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
    
    private function calculateGroupBalances($group)
    {
        $balances = collect();
        
        // If only one member, no settlements needed
        if ($group->members->count() <= 1) {
            return $balances;
        }
        
        foreach ($group->members as $member) {
            $totalPaid = 0;
            $totalShare = 0;
            
            // Calculate total paid by this member
            $paidExpenses = $group->expenses()
                ->whereHas('payers', function ($query) use ($member) {
                    $query->where('user_id', $member->id);
                })
                ->with(['payers' => function ($query) use ($member) {
                    $query->where('user_id', $member->id);
                }])
                ->get();
            
            foreach ($paidExpenses as $expense) {
                $totalPaid += $expense->payers->first()->pivot->amount_paid;
            }
            
            // Calculate total share of this member
            $participatedExpenses = $group->expenses()
                ->whereHas('participants', function ($query) use ($member) {
                    $query->where('user_id', $member->id);
                })
                ->with(['participants' => function ($query) use ($member) {
                    $query->where('user_id', $member->id);
                }])
                ->get();
            
            foreach ($participatedExpenses as $expense) {
                $totalShare += $expense->participants->first()->pivot->share_amount;
            }
            
            $balance = $totalPaid - $totalShare;
            
            $balances->put($member->id, [
                'user_id' => $member->id,
                'name' => $member->name,
                'total_paid' => $totalPaid,
                'total_share' => $totalShare,
                'balance' => $balance,
            ]);
        }
        
        return $balances;
    }
    
    private function calculateOverallSummary($user)
    {
        $totalToPay = 0;
        $totalToReceive = 0;
        
        // Calculate from settlements
        $settlementsToPay = $user->settlementsSent()->where('status', 'pending')->sum('amount');
        $settlementsToReceive = $user->settlementsReceived()->where('status', 'pending')->sum('amount');
        
        $totalToPay += $settlementsToPay;
        $totalToReceive += $settlementsToReceive;
        
        return [
            'to_pay' => $totalToPay,
            'to_receive' => $totalToReceive,
            'net_balance' => $totalToReceive - $totalToPay,
        ];
    }
    
    public function updateStatus(Request $request, Settlement $settlement)
    {
        $user = Auth::user();
        
        // Check if user is involved in this settlement
        if ($settlement->from_user_id !== $user->id && $settlement->to_user_id !== $user->id) {
            return back()->withErrors(['message' => 'You are not authorized to update this settlement.']);
        }
        
        $request->validate([
            'status' => 'required|in:completed,rejected',
        ]);
        
        $settlement->update(['status' => $request->status]);
        
        return back()->with('success', 'Settlement status updated successfully!');
    }
    
    public function create()
    {
        $user = Auth::user();
        
        // Get groups where user is a member
        $groups = $user->groups()->with('members')->get();
        
        return Inertia::render('Settlements/CreateSettlement', [
            'groups' => $groups,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
    
    public function createSettlement(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'to_user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01',
        ]);
        
        // Check if user is a member of the group
        $group = Group::findOrFail($request->group_id);
        if (!$group->members()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['message' => 'You are not a member of this group.']);
        }
        
        // Check if target user is a member of the group
        if (!$group->members()->where('user_id', $request->to_user_id)->exists()) {
            return back()->withErrors(['message' => 'Target user is not a member of this group.']);
        }
        
        // Create settlement
        Settlement::create([
            'group_id' => $request->group_id,
            'from_user_id' => $user->id,
            'to_user_id' => $request->to_user_id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);
        
        return back()->with('success', 'Settlement created successfully!');
    }
} 