<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['name', 'description', 'created_by'];
    public function users()
    {
        return $this->belongsToMany(User::class, 'group_user', 'group_id','user_id');
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
