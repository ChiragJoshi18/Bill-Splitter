<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\SettlementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register', [AuthenticatedSessionController::class, 'register']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user()->load('country');
    });
    
    // Dashboard data
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user()->load('country');
        
        // Get user's groups
        $groups = $user->groups()
            ->with('users:id,name')
            ->get(['groups.id', 'groups.name', 'groups.description', 'groups.created_by']);

        // Calculate financial summary
        $amountToPay = 0;
        $amountToReceive = 0;
        $totalExpenses = 0;

        $userExpenses = $user->expenses()->with(['group', 'payers'])->get();
        
        foreach ($userExpenses as $expense) {
            $pivot = $expense->pivot;
            $userShareAmount = $pivot->share_amount;
            $userPaidAmount = $expense->payers->where('id', $user->id)->first()?->pivot->amount_paid ?? 0;
            
            if ($userPaidAmount > 0) {
                $totalExpenses += $userPaidAmount;
                $amountToReceive += ($userPaidAmount - $userShareAmount);
            } else {
                $amountToPay += $userShareAmount;
            }
        }

        $settlementsToPay = $user->settlementsSent()->where('status', 'pending')->sum('amount');
        $settlementsToReceive = $user->settlementsReceived()->where('status', 'pending')->sum('amount');

        $amountToPay += $settlementsToPay;
        $amountToReceive += $settlementsToReceive;

        return response()->json([
            'groups' => $groups,
            'financialSummary' => [
                'amountToPay' => round($amountToPay, 2),
                'amountToReceive' => round($amountToReceive, 2),
                'totalExpenses' => round($totalExpenses, 2),
                'currencySymbol' => $user->currency_symbol,
            ],
        ]);
    });

    // Groups
    Route::get('/groups', [GroupController::class, 'apiIndex']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{group}', [GroupController::class, 'show']);
    Route::patch('/groups/{group}', [GroupController::class, 'update']);
    Route::delete('/groups/{group}', [GroupController::class, 'destroy']);

    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'apiIndex']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::get('/expenses/{expense}', [ExpenseController::class, 'show']);
    Route::patch('/expenses/{expense}', [ExpenseController::class, 'update']);
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy']);

    // Settlements
    Route::get('/settlements', [SettlementController::class, 'apiIndex']);
    Route::post('/settlements', [SettlementController::class, 'createSettlement']);
    Route::patch('/settlements/{settlement}/status', [SettlementController::class, 'updateStatus']);

    // Invites
    Route::get('/invites', [InviteController::class, 'apiIndex']);
    Route::post('/invites', [InviteController::class, 'store']);
    Route::patch('/invites/{invite}/accept', [InviteController::class, 'accept']);

    // Reports
    Route::get('/reports', [ReportController::class, 'apiIndex']);
    Route::get('/reports/group/{groupId}', [ReportController::class, 'apiGroupReport']);
    Route::post('/reports/export', [ReportController::class, 'exportReport']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'apiIndex']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);
}); 