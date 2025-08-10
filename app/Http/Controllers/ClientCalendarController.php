<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Viewing;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ClientCalendarController extends Controller
{
    public function index(User $client): JsonResponse
    {
        $auth = Auth::user();
        $roleName = optional($auth->role)->name;

        if (!in_array($roleName, ['agent', 'admin'])) {
            abort(403);
        }

        if ($roleName === 'agent') {
            // Agent must be assigned to a property that this client has interacted with
            $hasLink = Viewing::where('client_id', $client->id)
                ->whereHas('property', function ($q) use ($auth) {
                    $q->where('assigned_agent_id', $auth->id);
                })
                ->exists();
            if (!$hasLink) {
                abort(403);
            }
        }

        $start = request()->query('start');
        $end = request()->query('end');

        $query = Viewing::with(['property'])
            ->where('client_id', $client->id);

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
            ->map(function ($v) {
                return [
                    'id' => $v->id,
                    'title' => ($v->property?->title ?? 'Property'),
                    'start' => $v->start_at->toIso8601String(),
                    'end' => $v->end_at->toIso8601String(),
                    'extendedProps' => [
                        'property_id' => $v->property_id,
                        'status' => $v->status,
                        'property_title' => $v->property?->title,
                    ],
                ];
            });

        return response()->json($events);
    }
}


