<?php

namespace App\Services;

use App\Models\Property;
use App\Models\Deal;
use App\Models\Viewing;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ViewingService
{
    /**
     * Create viewing with overlap prevention. Times are expected to be ISO strings in UTC.
     *
     * @throws ValidationException
     */
    public function createViewing(Property $property, int $clientId, string $startIso, string $endIso, ?string $notes = null): Viewing
    {
        $startAt = CarbonImmutable::parse($startIso)->utc();
        $endAt = CarbonImmutable::parse($endIso)->utc();

        // Check for overlap: [start_at, end_at)
        $overlaps = Viewing::where('property_id', $property->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($startAt, $endAt) {
                $q->where(function ($qq) use ($startAt, $endAt) {
                    $qq->where('start_at', '<', $endAt)
                       ->where('end_at', '>', $startAt);
                });
            })
            ->exists();

        if ($overlaps) {
            throw ValidationException::withMessages([
                'start_at' => 'This time overlaps with an existing booking.',
            ]);
        }

        return DB::transaction(function () use ($property, $clientId, $startAt, $endAt, $notes) {
            return Viewing::create([
                'property_id' => $property->id,
                'client_id' => $clientId,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'notes' => $notes,
                'status' => 'pending',
            ]);
        });
    }

    /**
     * After creating a viewing, update the deal pipeline step for schedule.
     */
    public function markDealScheduled(Property $property, int $clientId): void
    {
        $deal = Deal::firstOrCreate(
            ['property_id' => $property->id, 'client_id' => $clientId],
            []
        );

        if (empty($deal->step_scheduled_at)) {
            $deal->step_scheduled_at = now();
            $deal->save();
        }
    }

    /**
     * Mark deals met when viewings have elapsed. Intended for a scheduled job/command.
     */
    public function markElapsedMeetingsAsMet(): int
    {
        $now = CarbonImmutable::now();
        $viewings = Viewing::whereIn('status', ['pending', 'confirmed'])
            ->where('end_at', '<', $now)
            ->get();

        $updated = 0;
        foreach ($viewings as $viewing) {
            $deal = Deal::firstOrCreate(
                ['property_id' => $viewing->property_id, 'client_id' => $viewing->client_id],
                []
            );
            if (empty($deal->step_met_at)) {
                $deal->step_met_at = now();
                $deal->save();
                $updated++;
            }
        }

        return $updated;
    }
}


