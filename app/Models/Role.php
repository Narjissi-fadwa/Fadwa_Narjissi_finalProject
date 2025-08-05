<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    //
    use HasFactory;

    // Allow mass assignment for name
    protected $fillable = ['name'];

    // relation role-user
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
