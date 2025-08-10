<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function store(Property $property): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            abort(403);
        }

        $roleName = optional($user->role)->name;
        if (!in_array($roleName, ['client', 'admin'])) {
            abort(403);
        }

        if ((int)$property->user_id === (int)$user->id) {
            abort(403, 'Owner cannot contact own property.');
        }

        if ($property->status !== 'active' || $property->approval_status !== 'approved') {
            return response()->json(['error' => 'Property not available.'], 422);
        }

        Deal::updateOrCreate(
            ['property_id' => $property->id, 'client_id' => $user->id],
            ['step_contacted_at' => now()]
        );

        return response()->json(['ok' => true]);
    }
}


