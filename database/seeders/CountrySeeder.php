<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            ['name' => 'United States', 'code' => 'US', 'currency_code' => 'USD', 'currency_symbol' => '$', 'currency_name' => 'US Dollar'],
            ['name' => 'India', 'code' => 'IN', 'currency_code' => 'INR', 'currency_symbol' => '₹', 'currency_name' => 'Indian Rupee'],
            ['name' => 'United Kingdom', 'code' => 'GB', 'currency_code' => 'GBP', 'currency_symbol' => '£', 'currency_name' => 'British Pound'],
            ['name' => 'European Union', 'code' => 'EU', 'currency_code' => 'EUR', 'currency_symbol' => '€', 'currency_name' => 'Euro'],
            ['name' => 'Canada', 'code' => 'CA', 'currency_code' => 'CAD', 'currency_symbol' => 'C$', 'currency_name' => 'Canadian Dollar'],
            ['name' => 'Australia', 'code' => 'AU', 'currency_code' => 'AUD', 'currency_symbol' => 'A$', 'currency_name' => 'Australian Dollar'],
            ['name' => 'Japan', 'code' => 'JP', 'currency_code' => 'JPY', 'currency_symbol' => '¥', 'currency_name' => 'Japanese Yen'],
            ['name' => 'China', 'code' => 'CN', 'currency_code' => 'CNY', 'currency_symbol' => '¥', 'currency_name' => 'Chinese Yuan'],
            ['name' => 'Brazil', 'code' => 'BR', 'currency_code' => 'BRL', 'currency_symbol' => 'R$', 'currency_name' => 'Brazilian Real'],
            ['name' => 'Mexico', 'code' => 'MX', 'currency_code' => 'MXN', 'currency_symbol' => '$', 'currency_name' => 'Mexican Peso'],
            ['name' => 'South Korea', 'code' => 'KR', 'currency_code' => 'KRW', 'currency_symbol' => '₩', 'currency_name' => 'South Korean Won'],
            ['name' => 'Singapore', 'code' => 'SG', 'currency_code' => 'SGD', 'currency_symbol' => 'S$', 'currency_name' => 'Singapore Dollar'],
            ['name' => 'Switzerland', 'code' => 'CH', 'currency_code' => 'CHF', 'currency_symbol' => 'CHF', 'currency_name' => 'Swiss Franc'],
            ['name' => 'Sweden', 'code' => 'SE', 'currency_code' => 'SEK', 'currency_symbol' => 'kr', 'currency_name' => 'Swedish Krona'],
            ['name' => 'Norway', 'code' => 'NO', 'currency_code' => 'NOK', 'currency_symbol' => 'kr', 'currency_name' => 'Norwegian Krone'],
            ['name' => 'Denmark', 'code' => 'DK', 'currency_code' => 'DKK', 'currency_symbol' => 'kr', 'currency_name' => 'Danish Krone'],
            ['name' => 'New Zealand', 'code' => 'NZ', 'currency_code' => 'NZD', 'currency_symbol' => 'NZ$', 'currency_name' => 'New Zealand Dollar'],
            ['name' => 'South Africa', 'code' => 'ZA', 'currency_code' => 'ZAR', 'currency_symbol' => 'R', 'currency_name' => 'South African Rand'],
            ['name' => 'Russia', 'code' => 'RU', 'currency_code' => 'RUB', 'currency_symbol' => '₽', 'currency_name' => 'Russian Ruble'],
            ['name' => 'Turkey', 'code' => 'TR', 'currency_code' => 'TRY', 'currency_symbol' => '₺', 'currency_name' => 'Turkish Lira'],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
} 