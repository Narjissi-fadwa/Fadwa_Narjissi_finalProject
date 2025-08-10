<?php

namespace App\Http\Requests;

use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreViewingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = Auth::user();
        /** @var Property $property */
        $property = $this->route('property');

        if (!$user) {
            return false;
        }

        // Only clients or admins can create; owners of the property cannot book their own property
        $roleName = optional($user->role)->name;
        if (!in_array($roleName, ['client', 'admin'])) {
            return false;
        }

        if ($property && (int) $property->user_id === (int) $user->id) {
            return false;
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'start_at' => ['required', 'date', 'after:now'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}


