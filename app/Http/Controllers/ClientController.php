<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Show the client dashboard.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();
        $purchases = Property::where('sold_to_client_id', $user->id)
            ->orderByDesc('sold_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'price' => $p->price,
                    'address' => $p->address,
                    'image' => $p->images && count($p->images) > 0 ? (str_starts_with($p->images[0], '/storage/') ? $p->images[0] : '/storage/' . $p->images[0]) : null,
                    'sold_at' => $p->sold_at,
                ];
            });

        return Inertia::render('client/dashboard', [
            'purchases' => $purchases,
        ]);
    }

    public function purchases(): Response
    {
        return $this->dashboard();
    }
}
