<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreViewingRequest;
use App\Models\Property;
use App\Models\Viewing;
use App\Services\ViewingService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ViewingController extends Controller
{
    public function __construct(private readonly ViewingService $viewingService)
    {
    }

    /**
     * List viewings for a property in FullCalendar-friendly format within optional range.
     */
    public function index(Property $property): JsonResponse
    {
        $start = request()->query('start');
        $end = request()->query('end');

        $query = Viewing::with('client')
            ->where('property_id', $property->id);

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
                    'title' => 'Viewing - ' . ($v->client?->name ?? 'Client'),
                    'start' => $v->start_at->toIso8601String(),
                    'end' => $v->end_at->toIso8601String(),
                    'extendedProps' => [
                        'client_name' => $v->client?->name,
                        'status' => $v->status,
                        'notes' => $v->notes,
                    ],
                ];
            });

        return response()->json($events);
    }

    /**
     * Create a viewing for a property.
     */
    public function store(StoreViewingRequest $request, Property $property): JsonResponse
    {
        $user = Auth::user();

        $viewing = $this->viewingService->createViewing(
            property: $property,
            clientId: $user->id,
            startIso: $request->input('start_at'),
            endIso: $request->input('end_at'),
            notes: $request->input('notes')
        );

        return response()->json([
            'id' => $viewing->id,
            'property_id' => $viewing->property_id,
            'start_at' => $viewing->start_at->toIso8601String(),
            'end_at' => $viewing->end_at->toIso8601String(),
            'status' => $viewing->status,
            'client_name' => $viewing->client?->name,
        ], 201);
    }
}


