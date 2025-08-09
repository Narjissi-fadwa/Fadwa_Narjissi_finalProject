<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'visitor_id',
        'offered_price',
        'status',
        'message',
        'responded_at',
    ];

    protected $casts = [
        'offered_price' => 'decimal:2',
        'responded_at' => 'datetime',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'visitor_id');
    }
}
