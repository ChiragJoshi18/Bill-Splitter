<?

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\GroupInviteMail;

class InviteController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'email' => 'required|email|unique:users,email',
        ]);

        $group = Group::findOrFail($request->group_id);

        // Ensure the current user is part of the group or is the creator
        if ($group->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $token = Str::random(40);

        GroupInvitation::create([
            'group_id' => $group->id,
            'email' => $request->email,
            'token' => $token,
            'invited_by' => Auth::id(),
        ]);

        // Send email
        Mail::to($request->email)->send(new GroupInviteMail($group, $token));

        return back()->with('success', 'Invitation sent!');
    }

    public function accept($token)
    {
        $invite = GroupInvitation::where('token', $token)->where('status', 'pending')->firstOrFail();

        $user = Auth::user();
        if ($user->email !== $invite->email) {
            abort(403, 'Unauthorized: Email mismatch');
        }

        $invite->status = 'accepted';
        $invite->save();

        // Attach user to the group (assuming many-to-many)
        $invite->group->members()->attach($user->id);

        return redirect('/dashboard')->with('success', 'You have joined the group!');
    }
}
?>
