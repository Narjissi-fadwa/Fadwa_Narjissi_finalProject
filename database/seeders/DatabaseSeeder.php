<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create users for test

        User::factory()->create([
            'name' => 'Agent User',
            'email' => 'agent@example.com',
            'password' => bcrypt('password'),
            'role_id' => 1,
        ]);
        User::factory()->create([
            'name' => 'Owner User',
            'email' => 'owner@example.com',
            'password' => bcrypt('password'),
            'role_id' => 2,
        ]);
        User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'role_id' => 3,
        ]);

        // seed role
        $this->call(RoleSeeder::class);
    }
}
