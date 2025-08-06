<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    /**
     * Show the agent dashboard.
     */
    public function dashboard(): Response
    {
        return Inertia::render('agent/dashboard');
    }
}
