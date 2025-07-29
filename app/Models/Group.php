<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name', 'description', 'created_by'];
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_members', 'group_id','user_id');
    }
    
    public function members()
    {
        return $this->belongsToMany(User::class, 'group_members', 'group_id', 'user_id')
                    ->withPivot('joined_at')
                    ->withTimestamps();
    }
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
    public function settlements()
    {
        return $this->hasMany(Settlement::class);
    }

}
