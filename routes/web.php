<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', function () {
    $user = Auth::user();

    
    if (!$user->role) {
        return Inertia::render('dashboard');
    }

    // Redirect to specific dashboard based on role 
    return match($user->role->name) {
        'admin' => redirect()->route('admin.dashboard'),
        'agent' => redirect()->route('agent.dashboard'),
        'owner' => redirect()->route('owner.dashboard'),
        'client' => redirect()->route('client.dashboard'),
        default => Inertia::render('dashboard')
    };
})->middleware(['auth', 'verified'])->name('dashboard');
// Role-based dashboards with proper access control
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:admin'])
    ->name('admin.dashboard');

Route::get('/agent/dashboard', [AgentController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:agent,admin'])
    ->name('agent.dashboard');

Route::get('/owner/dashboard', [OwnerController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:owner,admin'])
    ->name('owner.dashboard');

// Owner routes
Route::middleware(['auth', 'verified', 'role:owner,admin'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/calendar', function() {
        return inertia('owner/calendar');
    })->name('calendar');

    Route::get('/chat', function() {
        return inertia('owner/chat');
    })->name('chat');
});

Route::get('/client/dashboard', [ClientController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:client,admin'])
    ->name('client.dashboard');



// Property management routes
Route::middleware(['auth', 'verified', 'role:owner,admin'])->group(function () {
    Route::post('/properties/store', [PropertyController::class, 'store'])->name('properties.store');
    Route::put('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');


    // Payment routes
    Route::get('/payment/property/{property}', [PaymentController::class, 'showPaymentPage'])->name('payment.property');
    Route::post('/api/create-payment-intent', [PaymentController::class, 'createPaymentIntent'])->name('payment.create-intent');
    Route::post('/payment/success', [PaymentController::class, 'handlePaymentSuccess'])->name('payment.success');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/properties', [AdminController::class, 'manageProperties'])->name('properties');
    Route::post('/properties/{property}/approve', [AdminController::class, 'approveProperty'])->name('properties.approve');
    Route::post('/properties/{property}/assign-agent', [AdminController::class, 'assignAgent'])->name('properties.assign-agent');
    Route::post('/properties/{property}/status', function(\Illuminate\Http\Request $request, \App\Models\Property $property) {
        $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $property->update([
            'approval_status' => $request->status,
            'approved_at' => $request->status === 'approved' ? now() : null,
            'approved_by' => $request->status === 'approved' ? \Illuminate\Support\Facades\Auth::id() : null,
        ]);
        return back()->with('success', 'Property status updated successfully.');
    })->name('properties.status');

    Route::post('/properties/{property}/agent', function(\Illuminate\Http\Request $request, \App\Models\Property $property) {
        $request->validate(['agent_id' => 'nullable|exists:users,id']);
        $property->update(['assigned_agent_id' => $request->agent_id]);
        return back()->with('success', 'Agent assigned successfully.');
    })->name('properties.agent');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
