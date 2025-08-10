<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Role;
use App\Models\User;
use App\Models\Viewing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    public function test_client_cannot_overlap_existing_booking(): void
    {
        $owner = User::factory()->create(['role_id' => Role::where('name', 'owner')->first()->id]);
        $client = User::factory()->create(['role_id' => Role::where('name', 'client')->first()->id]);

        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'status' => 'active',
            'approval_status' => 'approved',
        ]);

        Viewing::create([
            'property_id' => $property->id,
            'client_id' => $client->id,
            'start_at' => now()->addDay()->setTime(10, 0),
            'end_at' => now()->addDay()->setTime(11, 0),
            'status' => 'pending',
        ]);

        $this->actingAs($client);

        $response = $this->postJson(route('properties.viewings.store', $property), [
            'start_at' => now()->addDay()->setTime(10, 30)->toIso8601String(),
            'end_at' => now()->addDay()->setTime(11, 30)->toIso8601String(),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['start_at']);
    }

    public function test_owner_cannot_book_own_property(): void
    {
        $owner = User::factory()->create(['role_id' => Role::where('name', 'owner')->first()->id]);
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'status' => 'active',
            'approval_status' => 'approved',
        ]);

        $this->actingAs($owner);

        $response = $this->postJson(route('properties.viewings.store', $property), [
            'start_at' => now()->addDay()->toIso8601String(),
            'end_at' => now()->addDay()->addHour()->toIso8601String(),
        ]);

        $response->assertStatus(403);
    }
}


