<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Show the client dashboard.
     */
    public function dashboard(): Response
    {
        return Inertia::render('client/dashboard');
    }
}
