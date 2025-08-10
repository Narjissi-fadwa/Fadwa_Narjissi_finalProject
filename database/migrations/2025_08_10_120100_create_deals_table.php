<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('step_contacted_at')->nullable();
            $table->timestamp('step_scheduled_at')->nullable();
            $table->timestamp('step_met_at')->nullable();
            $table->enum('outcome', ['sold', 'available', 'none'])->default('none');
            $table->timestamp('outcome_set_at')->nullable();
            $table->timestamps();
            $table->unique(['property_id', 'client_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};


