<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    /**
     * Show the agent dashboard.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();

        $assigned = Property::with(['owner:id,name,email', 'deals.client:id,name,email'])
            ->where('assigned_agent_id', $user->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'owner' => $p->owner ? ['id' => $p->owner->id, 'name' => $p->owner->name] : null,
                    'deals' => $p->deals->map(function ($d) {
                        return [
                            'id' => $d->id,
                            'client' => $d->client ? ['id' => $d->client->id, 'name' => $d->client->name] : null,
                            'step_contacted_at' => $d->step_contacted_at,
                            'step_scheduled_at' => $d->step_scheduled_at,
                            'step_met_at' => $d->step_met_at,
                            'outcome' => $d->outcome,
                        ];
                    }),
                ];
            });

        $all = Property::query()
            ->where('status', 'active')
            ->where('approval_status', 'approved')
            ->orderByDesc('id')
            ->limit(20)
            ->get(['id', 'title', 'type', 'price']);

        return Inertia::render('agent/dashboard', [
            'assignedProperties' => $assigned,
            'allListings' => $all,
        ]);
    }
}
