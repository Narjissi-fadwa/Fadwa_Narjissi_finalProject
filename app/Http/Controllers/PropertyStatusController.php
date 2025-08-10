<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Models\Property;
use App\Models\Viewing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PropertyStatusController extends Controller
{
    public function markSold(Request $request, Property $property): RedirectResponse
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        if ($user->id !== $property->user_id && optional($user->role)->name !== 'admin') {
            abort(403);
        }

        $clientId = (int) $request->input('client_id');

        $hasViewing = Viewing::where('property_id', $property->id)
            ->where('client_id', $clientId)
            ->exists();
        $hasDeal = Deal::where('property_id', $property->id)
            ->where('client_id', $clientId)
            ->exists();

        if (!$hasViewing && !$hasDeal) {
            return back()->withErrors(['client_id' => 'Client must have contacted or scheduled a viewing for this property.']);
        }

        $property->update([
            'status' => 'sold',
            'sold_to_client_id' => $clientId,
            'sold_at' => now(),
        ]);

        $deal = Deal::firstOrCreate([
            'property_id' => $property->id,
            'client_id' => $clientId,
        ]);

        if (empty($deal->step_met_at)) {
            $deal->step_met_at = now();
        }
        $deal->outcome = 'sold';
        $deal->outcome_set_at = now();
        $deal->save();

        return back()->with('success', 'Property marked as sold.');
    }

    public function markAvailable(Property $property): RedirectResponse
    {
        $user = Auth::user();
        if ($user->id !== $property->user_id && optional($user->role)->name !== 'admin') {
            abort(403);
        }

        $property->update([
            'status' => 'active',
            'sold_to_client_id' => null,
            'sold_at' => null,
        ]);

        Deal::where('property_id', $property->id)
            ->where('outcome', 'sold')
            ->update([
                'outcome' => 'available',
                'outcome_set_at' => now(),
            ]);

        return back()->with('success', 'Property set to available.');
    }
}


