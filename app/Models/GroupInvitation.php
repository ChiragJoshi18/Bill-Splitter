<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupInvitation extends Model
{
    protected $fillable = [
        'group_id',
        'email',
        'token',
        'invited_by',
    ];
}
