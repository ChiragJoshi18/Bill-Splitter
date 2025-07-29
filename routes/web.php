<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\SettlementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\InviteController;


// Homepage
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/groups/invite/accept/{token}', [InviteController::class, 'accept'])->name('groups.invite.accept');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user()->load('country');
        
        // Get user's groups
        $groups = $user->groups()
            ->with('users:id,name')
            ->get(['groups.id', 'groups.name', 'groups.description', 'groups.created_by']);

        // Calculate financial summary
        $amountToPay = 0;
        $amountToReceive = 0;
        $totalExpenses = 0;

        // Get all expenses where user is a participant
        $userExpenses = $user->expenses()->with(['group', 'payers'])->get();
        
        foreach ($userExpenses as $expense) {
            $pivot = $expense->pivot;
            $userShareAmount = $pivot->share_amount;
            
            // Check if user is a payer for this expense
            $userPaidAmount = $expense->payers->where('id', $user->id)->first()?->pivot->amount_paid ?? 0;
            
            if ($userPaidAmount > 0) {
                $totalExpenses += $userPaidAmount;
                // User should receive the difference between what they paid and what they owe
                $amountToReceive += ($userPaidAmount - $userShareAmount);
            } else {
                // User owes money for this expense
                $amountToPay += $userShareAmount;
            }
        }

        // Get settlements
        $settlementsToPay = $user->settlementsSent()->where('status', 'pending')->sum('amount');
        $settlementsToReceive = $user->settlementsReceived()->where('status', 'pending')->sum('amount');

        $amountToPay += $settlementsToPay;
        $amountToReceive += $settlementsToReceive;

        return Inertia::render('dashboard', [
            'groups' => $groups,
            'financialSummary' => [
                'amountToPay' => round($amountToPay, 2),
                'amountToReceive' => round($amountToReceive, 2),
                'totalExpenses' => round($totalExpenses, 2),
                'currencySymbol' => $user->currency_symbol,
            ],
        ]);
    })->name('dashboard');

    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index');

    Route::get('/invites', [InviteController::class, 'index'])->name('invites.index');

    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');
Route::get('/expenses/create', [ExpenseController::class, 'create'])->name('expenses.create');
Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');

// Settlements
Route::get('/settlements', [SettlementController::class, 'index'])->name('settlements.index');
Route::get('/settlements/create', [SettlementController::class, 'create'])->name('settlements.create');
Route::post('/settlements', [SettlementController::class, 'createSettlement'])->name('settlements.store');
Route::patch('/settlements/{settlement}/status', [SettlementController::class, 'updateStatus'])->name('settlements.update-status');

// Notifications
Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');

// Reports
Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
Route::get('/reports/group/{groupId}', [ReportController::class, 'groupReport'])->name('reports.group');
Route::post('/reports/export', [ReportController::class, 'exportReport'])->name('reports.export');

    Route::controller(GroupController::class)->group(function () {
        Route::get('/groups/create', 'create')->name('groups.create');
        Route::post('/groups', 'store')->name('groups.store');
        Route::patch('/groups/{group}', 'update')->name('groups.update');
        Route::delete('/groups/{group}', 'destroy')->name('groups.destroy');

        Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
        Route::patch('/groups/{group}', [GroupController::class, 'update'])->name('groups.update');
        Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->name('groups.destroy');
    });



    Route::post('/groups/invite/send', [InviteController::class, 'send'])->name('groups.invite.send');

    Route::fallback(function () {
        return "<h1>Page Not found</h1>";
    });
});



// Additional files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
