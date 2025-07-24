<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\InviteController; 


// Homepage
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authenticated routes
// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        $groups = $user->groups()
            ->with('users:id,name') 
            ->get(['groups.id', 'groups.name', 'groups.description', 'groups.created_by']);

        return Inertia::render('dashboard', [
            'groups' => $groups,
        ]);
    })->name('dashboard');

    Route::get('/groups', function () {
        return Inertia::render('Groups/GroupList');
    })->name('groups.index');

    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::patch('/groups/{group}', [GroupController::class, 'update'])->name('groups.update');
    Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->name('groups.destroy');

    Route::post('/groups/invite/send', [InviteController::class, 'send'])->name('groups.invite.send');
    Route::get('/groups/invite/accept/{token}', [InviteController::class, 'accept'])->name('groups.invite.accept');
});



// Additional files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
