<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    public function group()
{
    return $this->belongsTo(Group::class);
}

public function payer()
{
    return $this->belongsTo(User::class, 'paid_by');
}

public function participants()
{
    return $this->belongsToMany(User::class)->withPivot('amount');
}
}
