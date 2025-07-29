<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\GroupInviteMail;
use Inertia\Inertia;

class InviteController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $invitations = Invitation::where('invited_by', $user->id)
            ->with(['group:id,name', 'inviter:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'email' => $invitation->invited_email,
                    'status' => $invitation->status,
                    'created_at' => $invitation->created_at,
                    'group' => [
                        'id' => $invitation->group->id,
                        'name' => $invitation->group->name,
                    ],
                    'inviter' => [
                        'id' => $invitation->inviter->id,
                        'name' => $invitation->inviter->name,
                    ],
                ];
            });

        return Inertia::render('Invites/InviteList', [
            'invitations' => $invitations,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'email' => 'required|email',
        ]);

        $group = Group::findOrFail($request->group_id);

        // Ensure the current user is the creator of the group
        if ($group->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Check if user already exists
        $existingUser = User::where('email', $request->email)->first();
        
        // Check if user is already a member of the group
        if ($existingUser && $group->users()->where('user_id', $existingUser->id)->exists()) {
            return back()->with('error', 'User is already a member of this group.');
        }

        // Check if invitation already exists and is pending
        $existingInvite = Invitation::where('group_id', $group->id)
            ->where('invited_email', $request->email)
            ->where('status', 'pending')
            ->first();

        if ($existingInvite) {
            return back()->with('error', 'An invitation has already been sent to this email address.');
        }

        Invitation::create([
            'group_id' => $group->id,
            'invited_email' => $request->email,
            'invited_by' => Auth::id(),
            'status' => 'pending',
        ]);

        // Send email
        Mail::to($request->email)->send(new GroupInviteMail($group, 'token-placeholder'));

        return back()->with('success', 'Invitation sent successfully!');
    }
}
