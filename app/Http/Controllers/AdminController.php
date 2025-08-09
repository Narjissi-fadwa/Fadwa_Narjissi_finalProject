<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'total_properties' => Property::count(),
            'pending_properties' => Property::where('approval_status', 'pending')->count(),
            'approved_properties' => Property::where('approval_status', 'approved')->count(),
            'total_users' => User::count(),
            'total_agents' => User::whereHas('role', function($query) {
                $query->where('name', 'agent');
            })->count(),
            'total_owners' => User::whereHas('role', function($query) {
                $query->where('name', 'owner');
            })->count(),
        ];

        // Get all properties for management
        $properties = Property::with(['owner', 'assignedAgent'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all agents for assignment dropdown
        $agents = User::whereHas('role', function($query) {
            $query->where('name', 'agent');
        })->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'properties' => $properties,
            'agents' => $agents,
        ]);
    }

    public function manageProperties(Request $request): Response
    {
        $query = Property::with(['owner', 'assignedAgent', 'approvedBy']);

        if ($request->has('status') && $request->status !== '') {
            $query->where('approval_status', $request->status);
        }

        if ($request->has('search') && $request->search !== '') {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('address', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('agent') && $request->agent !== '') {
            $query->where('assigned_agent_id', $request->agent);
        }

        $properties = $query->orderBy('created_at', 'desc')->paginate(15);

        $agents = User::whereHas('role', function($query) {
            $query->where('name', 'agent');
        })->get(['id', 'name', 'city']);

        return Inertia::render('admin/manage-properties', [
            'properties' => $properties,
            'agents' => $agents,
            'filters' => $request->only(['status', 'search', 'agent']),
        ]);
    }

    public function approveProperty(Request $request, Property $property)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'rejection_reason' => 'required_if:action,reject|string|max:500',
            'assigned_agent_id' => 'nullable|exists:users,id',
        ]);

        if ($request->action === 'approve') {
            $property->update([
                'approval_status' => 'approved',
                'approved_at' => now(),
                'approved_by' => Auth::id(),
                'assigned_agent_id' => $request->assigned_agent_id,
                'status' => 'active',
            ]);

            return back()->with('success', 'Property approved successfully. Owner will be notified to complete payment.');
        } else {
            $property->update([
                'approval_status' => 'rejected',
                'rejection_reason' => $request->rejection_reason,
                'approved_by' => Auth::id(),
            ]);

            return back()->with('success', 'Property rejected.');
        }
    }

    public function assignAgent(Request $request, Property $property)
    {
        $request->validate([
            'agent_id' => 'required|exists:users,id',
        ]);

        $agent = User::with('role')->find($request->agent_id);
        if (!$agent || $agent->role->name !== 'agent') {
            return back()->withErrors(['agent_id' => 'Selected user is not an agent.']);
        }

        $property->update([
            'assigned_agent_id' => $request->agent_id,
        ]);

        return back()->with('success', 'Agent assigned successfully.');
    }

    public function updatePropertyStatus(Request $request, Property $property)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $property->update([
            'approval_status' => $request->status,
            'approved_at' => $request->status === 'approved' ? now() : null,
            'approved_by' => $request->status === 'approved' ? $request->user()->id : null,
        ]);

        return back()->with('success', 'Property status updated successfully.');
    }

    public function updatePropertyAgent(Request $request, Property $property)
    {
        $request->validate([
            'agent_id' => 'nullable|exists:users,id',
        ]);
        $property->update([
            'assigned_agent_id' => $request->agent_id,
        ]);

        return back()->with('success', 'Agent assigned successfully.');
    }
}
