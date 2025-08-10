<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->streetName . ' Residence',
            'address' => $this->faker->address,
            'type' => $this->faker->randomElement(['apartment', 'house', 'villa', 'land']),
            'property_subtype' => null,
            'area' => $this->faker->numberBetween(50, 250),
            'description' => $this->faker->paragraph,
            'price' => $this->faker->numberBetween(100000, 900000),
            'listing_type' => $this->faker->randomElement(['sale', 'rent']),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'floors' => null,
            'status' => 'active',
            'payment_status' => 'pending',
            'images' => [],
            'approval_status' => 'approved',
            'approved_at' => now(),
        ];
    }
}


