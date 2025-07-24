<?php

namespace App\Http\Controllers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


use App\Models\Group; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    use AuthorizesRequests;
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

        return redirect()->back()->with('success', 'Group created successfully.');
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
