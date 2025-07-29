<?php

namespace App\Models;
use App\Models\Group;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'country_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_members', 'user_id', 'group_id')
                    ->withPivot('joined_at')
                    ->withTimestamps();
    }
    
    public function expenses()
    {
        return $this->belongsToMany(Expense::class, 'expense_participants', 'user_id', 'expense_id')
                    ->withPivot('share_amount')
                    ->withTimestamps();
    }
    
    public function paidExpenses()
    {
        return $this->belongsToMany(Expense::class, 'expense_payers', 'user_id', 'expense_id')
                    ->withPivot('amount_paid')
                    ->withTimestamps();
    }
        public function settlementsSent()
    {
        return $this->hasMany(Settlement::class, 'from_user_id');
    }

    public function settlementsReceived()
    {
        return $this->hasMany(Settlement::class, 'to_user_id');
    }

    /**
     * Get the country for this user.
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the user's currency information.
     */
    public function getCurrencyAttribute()
    {
        return $this->country?->currency_code ?? 'USD';
    }

    /**
     * Get the user's currency symbol.
     */
    public function getCurrencySymbolAttribute()
    {
        return $this->country?->currency_symbol ?? '$';
    }

}
