<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'created_by',
        'group_id',
        'title',
        'description',
        'total_amount',
        'expense_date',
        'category',
    ];

    protected $casts = [
        'expense_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'expense_participants')
                    ->withPivot('share_amount')
                    ->withTimestamps();
    }

    public function payers()
    {
        return $this->belongsToMany(User::class, 'expense_payers')
                    ->withPivot('amount_paid')
                    ->withTimestamps();
    }
}
