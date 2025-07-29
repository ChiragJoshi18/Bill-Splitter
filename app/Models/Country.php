<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'currency_code',
        'currency_symbol',
        'currency_name',
    ];

    /**
     * Get the users for this country.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the formatted currency display.
     */
    public function getFormattedCurrencyAttribute()
    {
        return $this->currency_symbol . ' ' . $this->currency_name;
    }
} 