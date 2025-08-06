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
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $user = $request->user();
        if (!$user->role) {
            abort(403, 'User has no role assigned.');
        }

        // Get  allowed roles 
        if (count($roles) === 1 && strpos($roles[0], ',') !== false) {
            $allowedRoles = array_filter(array_map('trim', explode(',', $roles[0])));
        } else {
            $allowedRoles = array_filter(array_map('trim', $roles));
        }

        $userRole = $user->role->name;

        // Check if user's role is in allowed roles
        if (!in_array($userRole, $allowedRoles)) {
            abort(403, 'Access denied. Your role "' . $userRole . '" is not allowed. Required: ' . implode(', ', $allowedRoles));
        }

        return $next($request);
    }
}
