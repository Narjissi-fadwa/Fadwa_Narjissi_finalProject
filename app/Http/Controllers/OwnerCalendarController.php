<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Viewing;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class OwnerCalendarController extends Controller
{
    public function index(User $owner): JsonResponse
    {
        $auth = Auth::user();
        $roleName = optional($auth->role)->name;

        if (!in_array($roleName, ['owner', 'admin'])) {
            abort(403);
        }

        // Owners can only view their own calendar unless admin
        if ($roleName === 'owner' && $auth->id !== $owner->id) {
            abort(403);
        }

        $start = request()->query('start');
        $end = request()->query('end');

        $propertyIds = $owner->properties()->pluck('id');

        $query = Viewing::with(['client', 'property'])
            ->whereIn('property_id', $propertyIds);

        if ($start && $end) {
            $startAt = CarbonImmutable::parse($start)->utc();
            $endAt = CarbonImmutable::parse($end)->utc();
            $query->where(function ($q) use ($startAt, $endAt) {
                $q->where('start_at', '<', $endAt)
                  ->where('end_at', '>', $startAt);
            });
        }

        $events = $query->orderBy('start_at')
            ->get()
            ->map(function (Viewing $v) {
                return [
                    'id' => $v->id,
                    'title' => ($v->property?->title ?? 'Property') . ' - ' . ($v->client?->name ?? 'Client'),
                    'start' => $v->start_at->toIso8601String(),
                    'end' => $v->end_at->toIso8601String(),
                    'extendedProps' => [
                        'property_id' => $v->property_id,
                        'client_name' => $v->client?->name,
                        'status' => $v->status,
                        'notes' => $v->notes,
                        'property_title' => $v->property?->title,
                    ],
                ];
            });

        return response()->json($events);
    }
}


