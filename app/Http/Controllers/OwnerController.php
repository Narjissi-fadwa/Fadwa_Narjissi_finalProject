<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class OwnerController extends Controller
{
    /**
     * Show the owner dashboard.
     */
    public function dashboard(): Response
    {
        return Inertia::render('owner/dashboard');
    }
}
