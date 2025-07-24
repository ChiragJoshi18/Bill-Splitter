<!DOCTYPE html>
<html>
<head>
    <title>Group Invitation</title>
</head>
<body>
    <h1>You are invited to join the group: {{ $groupName }}</h1>
    <p>Click the link below to accept the invitation:</p>
    <a href="{{ $inviteLink }}">{{ $inviteLink }}</a>
    <p>If you didn’t expect this, you can ignore the message.</p>
</body>
</html>