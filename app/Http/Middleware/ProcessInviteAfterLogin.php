<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Invitation;
use App\Http\Controllers\InviteController;
use Illuminate\Support\Facades\Auth;

class ProcessInviteAfterLogin
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // For now, we'll handle invitation completion differently
        // since the invitations table doesn't have a token field
        return $response;
    }
}

?>
