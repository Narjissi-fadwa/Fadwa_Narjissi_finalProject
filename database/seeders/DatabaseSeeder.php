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
        // Seed roles first
        $this->call(RoleSeeder::class);

        // Create baseline users idempotently (will not duplicate if rerun)
        $roles = Role::pluck('id', 'name');

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role_id' => $roles['admin'] ?? null,
            ]
        );

        User::firstOrCreate(
            ['email' => 'agent@example.com'],
            [
                'name' => 'Agent User',
                'password' => bcrypt('password'),
                'role_id' => $roles['agent'] ?? null,
            ]
        );

        User::firstOrCreate(
            ['email' => 'owner@example.com'],
            [
                'name' => 'Owner User',
                'password' => bcrypt('password'),
                'role_id' => $roles['owner'] ?? null,
            ]
        );

        User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Client User',
                'password' => bcrypt('password'),
                'role_id' => $roles['client'] ?? null,
            ]
        );
    }
}
