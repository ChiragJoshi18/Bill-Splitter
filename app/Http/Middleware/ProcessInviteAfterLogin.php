<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\GroupInvitation;
use App\Http\Controllers\InviteController;
use Illuminate\Support\Facades\Auth;

class ProcessInviteAfterLogin
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (session()->has('invite_token') && Auth::check()) {
            $token = session('invite_token');

            $invite = GroupInvitation::where('token', $token)
                ->where('status', 'pending')
                ->first();

            if ($invite && $invite->email === Auth::user()->email) {
                app(InviteController::class)->completeInvitation($invite);
            }

            session()->forget('invite_token');
        }

        return $response;
    }
}

?>
