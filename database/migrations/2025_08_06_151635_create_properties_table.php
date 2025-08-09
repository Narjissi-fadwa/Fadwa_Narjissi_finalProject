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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('address');
            $table->enum('type', ['apartment', 'house', 'villa', 'land']);
            $table->string('property_subtype')->nullable(); // bedrooms count or floors
            $table->decimal('area', 10, 2); // square meters
            $table->text('description');
            $table->decimal('price', 12, 2);
            $table->enum('listing_type', ['sale', 'rent']);
            $table->integer('bedrooms')->nullable(); // for apartments
            $table->string('floors')->nullable(); // for houses (R+1, R+2, etc.)
            $table->enum('status', ['active', 'inactive', 'sold', 'rented'])->default('active');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('stripe_payment_intent_id')->nullable();
            $table->json('images')->nullable(); // Store multiple image paths
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
