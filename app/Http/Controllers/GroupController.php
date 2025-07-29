<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


use App\Models\Group; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        
        $groups = $user->groups()
            ->with(['users:id,name', 'expenses'])
            ->withCount(['expenses', 'users'])
            ->get()
            ->map(function ($group) {
                // Calculate total expenses for this group
                $totalExpenses = $group->expenses->sum('total_amount');
                
                // Calculate user's share in this group
                $userExpenses = $group->expenses()
                    ->whereHas('participants', function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->get();
                
                $userShare = $userExpenses->sum(function ($expense) {
                    return $expense->participants()
                        ->where('user_id', Auth::id())
                        ->first()
                        ->pivot
                        ->share_amount ?? 0;
                });
                
                // Calculate what user paid in this group
                $userPaid = $group->expenses()
                    ->whereHas('payers', function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->get()
                    ->sum(function ($expense) {
                        return $expense->payers()
                            ->where('user_id', Auth::id())
                            ->first()
                            ->pivot
                            ->amount_paid ?? 0;
                    });
                
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'created_by' => $group->created_by,
                    'created_at' => $group->created_at,
                    'users' => $group->users,
                    'users_count' => $group->users_count,
                    'expenses_count' => $group->expenses_count,
                    'total_expenses' => round($totalExpenses, 2),
                    'user_share' => round($userShare, 2),
                    'user_paid' => round($userPaid, 2),
                    'user_balance' => round($userPaid - $userShare, 2),
                ];
            });

        return inertia('Groups/GroupList', [
            'groups' => $groups,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'currency_symbol' => $user->currency_symbol,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $group = \App\Models\Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'created_by' => Auth::id(),
        ]);

        $group->users()->attach(Auth::id());

        // Load the group with users for the response
        $group->load('users:id,name');
        $group->users_count = 1;
        $group->expenses_count = 0;
        $group->total_expenses = 0;
        $group->user_share = 0;
        $group->user_paid = 0;
        $group->user_balance = 0;

        return redirect()->back()->with('success', 'Group created successfully.')->with('group', $group);
    }
    public function update(Request $request, \App\Models\Group $group)
    {
        

        if ($group->created_by !== Auth::id()) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $group->update($validated);

        return redirect()->back()->with('success', 'Group updated successfully.');
    }
    public function destroy(Group $group)
{
    if ($group->created_by !== Auth::id()) {
        abort(403, 'Unauthorized.');
    }

    $group->delete();

    return redirect()->back()->with('success', 'Group deleted successfully.');
}


}
