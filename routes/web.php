<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\OwnerController;
use Illuminate\Support\Facades\Auth;
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
// Role-based dashboards 
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:admin'])
    ->name('admin.dashboard');

Route::get('/agent/dashboard', [AgentController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:agent'])
    ->name('agent.dashboard');

Route::get('/owner/dashboard', [OwnerController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:owner'])
    ->name('owner.dashboard');

Route::get('/client/dashboard', [ClientController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'role:client'])
    ->name('client.dashboard');


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
