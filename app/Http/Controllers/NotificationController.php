<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Settlement;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $notifications = collect();
        
        // Get recent expenses from groups where user is a member (last 7 days)
        $recentExpenses = Expense::whereHas('group.members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('created_at', '>=', now()->subDays(7))
        ->where('created_by', '!=', $user->id) // Don't show own expenses
        ->with(['creator:id,name', 'group:id,name'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($expense) {
            return [
                'id' => 'expense_' . $expense->id,
                'type' => 'new_expense',
                'title' => 'New expense added',
                'message' => $expense->creator->name . ' added "' . $expense->title . '" to ' . $expense->group->name,
                'data' => [
                    'expense_id' => $expense->id,
                    'group_id' => $expense->group->id,
                    'creator_name' => $expense->creator->name,
                    'expense_title' => $expense->title,
                    'group_name' => $expense->group->name,
                    'amount' => $expense->total_amount,
                ],
                'created_at' => $expense->created_at,
                'is_read' => false, // We'll implement read status later
            ];
        });
        
        $notifications = $notifications->merge($recentExpenses);
        
        // Get recent settlements involving the user (last 7 days)
        $recentSettlements = Settlement::where(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
        })
        ->where('created_at', '>=', now()->subDays(7))
        ->with(['fromUser:id,name', 'toUser:id,name', 'group:id,name'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($settlement) use ($user) {
            $isFromMe = $settlement->from_user_id === $user->id;
            $otherUser = $isFromMe ? $settlement->toUser : $settlement->fromUser;
            
            return [
                'id' => 'settlement_' . $settlement->id,
                'type' => 'new_settlement',
                'title' => $isFromMe ? 'Settlement sent' : 'Settlement received',
                'message' => $isFromMe 
                    ? 'You sent a settlement of ₹' . $settlement->amount . ' to ' . $otherUser->name . ' in ' . $settlement->group->name
                    : $otherUser->name . ' sent you a settlement of ₹' . $settlement->amount . ' in ' . $settlement->group->name,
                'data' => [
                    'settlement_id' => $settlement->id,
                    'group_id' => $settlement->group->id,
                    'amount' => $settlement->amount,
                    'status' => $settlement->status,
                    'is_from_me' => $isFromMe,
                    'other_user_name' => $otherUser->name,
                    'group_name' => $settlement->group->name,
                ],
                'created_at' => $settlement->created_at,
                'is_read' => false,
            ];
        });
        
        $notifications = $notifications->merge($recentSettlements);
        
        // Get recent settlement status changes (last 7 days)
        $settlementUpdates = Settlement::where(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
        })
        ->where('updated_at', '>=', now()->subDays(7))
        ->where('updated_at', '!=', 'created_at') // Only status changes
        ->with(['fromUser:id,name', 'toUser:id,name', 'group:id,name'])
        ->orderBy('updated_at', 'desc')
        ->get()
        ->map(function ($settlement) use ($user) {
            $isFromMe = $settlement->from_user_id === $user->id;
            $otherUser = $isFromMe ? $settlement->toUser : $settlement->fromUser;
            
            $statusMessage = match($settlement->status) {
                'completed' => 'accepted',
                'rejected' => 'rejected',
                default => 'updated'
            };
            
            return [
                'id' => 'settlement_update_' . $settlement->id,
                'type' => 'settlement_update',
                'title' => 'Settlement ' . $statusMessage,
                'message' => $isFromMe 
                    ? $otherUser->name . ' ' . $statusMessage . ' your settlement of ₹' . $settlement->amount . ' in ' . $settlement->group->name
                    : 'You ' . $statusMessage . ' ' . $otherUser->name . '\'s settlement of ₹' . $settlement->amount . ' in ' . $settlement->group->name,
                'data' => [
                    'settlement_id' => $settlement->id,
                    'group_id' => $settlement->group->id,
                    'amount' => $settlement->amount,
                    'status' => $settlement->status,
                    'is_from_me' => $isFromMe,
                    'other_user_name' => $otherUser->name,
                    'group_name' => $settlement->group->name,
                ],
                'created_at' => $settlement->updated_at,
                'is_read' => false,
            ];
        });
        
        $notifications = $notifications->merge($settlementUpdates);
        
        // Get recent group invitations (last 30 days)
        $recentInvitations = Invitation::where('invited_email', $user->email)
        ->where('created_at', '>=', now()->subDays(30))
        ->with(['inviter:id,name', 'group:id,name'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($invitation) {
            return [
                'id' => 'invitation_' . $invitation->id,
                'type' => 'group_invitation',
                'title' => 'Group invitation',
                'message' => $invitation->inviter->name . ' invited you to join ' . $invitation->group->name,
                'data' => [
                    'invitation_id' => $invitation->id,
                    'group_id' => $invitation->group->id,
                    'inviter_name' => $invitation->inviter->name,
                    'group_name' => $invitation->group->name,
                    'status' => $invitation->status,
                ],
                'created_at' => $invitation->created_at,
                'is_read' => false,
            ];
        });
        
        $notifications = $notifications->merge($recentInvitations);
        
        // Sort all notifications by created_at (most recent first)
        $notifications = $notifications->sortByDesc('created_at')->values();
        
        // Count unread notifications
        $unreadCount = $notifications->where('is_read', false)->count();
        
        return Inertia::render('Notifications/NotificationList', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
    
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        // Count recent unread notifications (last 7 days)
        $unreadCount = 0;
        
        // Count new expenses
        $unreadCount += Expense::whereHas('group.members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('created_at', '>=', now()->subDays(7))
        ->where('created_by', '!=', $user->id)
        ->count();
        
        // Count new settlements
        $unreadCount += Settlement::where(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->orWhere('to_user_id', $user->id);
        })
        ->where('created_at', '>=', now()->subDays(7))
        ->count();
        
        // Count pending invitations
        $unreadCount += Invitation::where('invited_email', $user->email)
        ->where('status', 'pending')
        ->count();
        
        return response()->json(['unreadCount' => $unreadCount]);
    }
} 