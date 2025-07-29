<?
namespace App\Mail;

use App\Models\Group;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GroupInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $group;
    public $token;

    public function __construct(Group $group, string $token)
    {
        $this->group = $group;
        $this->token = $token;
    }

    public function build()
    {
        $inviteLink = url('/groups/invite/accept/' . $this->token);

        return $this->subject('You are invited to join a group')
            ->view('emails.invite')
            ->with([
                'groupName' => $this->group->name,
                'groupDescription' => $this->group->description,
                'inviteLink' => $inviteLink,
            ]);
    }
}

?>
