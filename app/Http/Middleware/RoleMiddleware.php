<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        //  allowed roles 
        $allowedRoles = array_map('trim', explode(',', $roles));

        $userRole = $request->user()->role->name;

        // user's role not allowed to access this route
        if (!in_array($userRole, $allowedRoles)) {
            abort(403, 'Access denied. You do not have the required role.');
        }

        return $next($request);
    }
}
