<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'client_id',
        'step_contacted_at',
        'step_scheduled_at',
        'step_met_at',
        'outcome',
        'outcome_set_at',
    ];

    protected $casts = [
        'step_contacted_at' => 'datetime',
        'step_scheduled_at' => 'datetime',
        'step_met_at' => 'datetime',
        'outcome_set_at' => 'datetime',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}


