<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'address',
        'type',
        'property_subtype',
        'area',
        'description',
        'price',
        'listing_type',
        'bedrooms',
        'floors',
        'status',
        'payment_status',
        'stripe_payment_intent_id',
        'images',
        'assigned_agent_id',
        'approval_status',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'area' => 'decimal:2',
        'bedrooms' => 'integer',
        'floors' => 'integer',
        'images' => 'array',
        'approved_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function visits(): HasMany
    {
        return $this->hasMany(PropertyVisit::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(PropertyOffer::class);
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getVisitsCountAttribute(): int
    {
        return $this->visits()->count();
    }

    public function getPendingOffersAttribute()
    {
        return $this->offers()->where('status', 'pending')->get();
    }

    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    public function isRejected(): bool
    {
        return $this->approval_status === 'rejected';
    }
}
