<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\GroupInvitation;
use Illuminate\Support\Facades\Auth;

class CompleteInvitation
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (session()->has('invite_token') && Auth::check()) {
            $token = session('invite_token');
            $invite = GroupInvitation::where('token', $token)
                ->where('status', 'pending')
                ->first();

            if ($invite && Auth::user()->email === $invite->email) {
                if (!$invite->group->members()->where('user_id', Auth::id())->exists()) {
                    $invite->group->members()->attach(Auth::id());
                }
                $invite->update(['status' => 'accepted']);
                session()->forget('invite_token');
            }
        }

        return $response;
    }
}
