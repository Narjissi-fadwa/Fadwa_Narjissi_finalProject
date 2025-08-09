<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role_id',
        'city',
        'interest',
    ];
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    //relation user-role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Properties owned by this user
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    // Properties assigned to this agent
    public function assignedProperties()
    {
        return $this->hasMany(Property::class, 'assigned_agent_id');
    }

    // Properties approved by this user (admin/agent)
    public function approvedProperties()
    {
        return $this->hasMany(Property::class, 'approved_by');
    }

    // Property visits as a visitor
    public function propertyVisits()
    {
        return $this->hasMany(PropertyVisit::class, 'visitor_id');
    }

    // Property offers made by this user
    public function propertyOffers()
    {
        return $this->hasMany(PropertyOffer::class, 'visitor_id');
    }

    // Check if user is an agent
    public function isAgent(): bool
    {
        return $this->role && $this->role->name === 'agent';
    }

    // Check if user is an admin
    public function isAdmin(): bool
    {
        return $this->role && $this->role->name === 'admin';
    }

    // Check if user is an owner
    public function isOwner(): bool
    {
        return $this->role && $this->role->name === 'owner';
    }
}
