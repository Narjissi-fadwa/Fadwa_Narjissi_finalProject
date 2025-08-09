<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyVisit;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OwnerController extends Controller
{
    /**
     * Show the owner dashboard.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();

        // properties dyal current user
        $properties = Property::where('user_id', $user->id)
            ->with(['visits', 'offers.visitor', 'assignedAgent', 'approvedBy'])
            ->withCount('visits')
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'address' => $property->address,
                    'type' => $property->type,
                    'property_subtype' => $property->property_subtype,
                    'area' => $property->area,
                    'description' => $property->description,
                    'price' => $property->price,
                    'listing_type' => $property->listing_type,
                    'bedrooms' => $property->bedrooms,
                    'floors' => $property->floors,
                    'status' => $property->status,
                    'payment_status' => $property->payment_status,
                    'approval_status' => $property->approval_status,
                    'approved_at' => $property->approved_at,
                    'rejection_reason' => $property->rejection_reason,
                    'assigned_agent' => $property->assignedAgent ? [
                        'id' => $property->assignedAgent->id,
                        'name' => $property->assignedAgent->name,
                        'email' => $property->assignedAgent->email,
                    ] : null,
                    'images' => $property->images ? array_map(function($path) {
                        // If path already starts with /storage/, return as is
                        // Otherwise, prepend /storage/
                        return str_starts_with($path, '/storage/') ? $path : '/storage/' . $path;
                    }, $property->images) : [],
                    'visits_count' => $property->visits_count,
                    'pending_offers' => $property->offers->where('status', 'pending')->map(function ($offer) {
                        return [
                            'id' => $offer->id,
                            'offered_price' => $offer->offered_price,
                            'message' => $offer->message,
                            'visitor_name' => $offer->visitor->name,
                            'created_at' => $offer->created_at,
                        ];
                    }),
                    'created_at' => $property->created_at,
                ];
            });

        

        return Inertia::render('owner/dashboard', [
            'properties' => $properties,
        ]);
    }
}
