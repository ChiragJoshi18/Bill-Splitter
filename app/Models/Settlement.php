<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Settlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'from_user_id',
        'to_user_id',
        'amount',
        'is_settled',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    public function fromUser()  
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }
    public function toUser()
    {
        return $this->belongsTo(User::class,'to_user_id');
    }
}
