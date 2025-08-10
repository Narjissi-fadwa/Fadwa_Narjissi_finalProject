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
        Schema::table('properties', function (Blueprint $table) {
            $table->foreignId('sold_to_client_id')->nullable()->after('approved_by')->constrained('users')->nullOnDelete();
            $table->timestamp('sold_at')->nullable()->after('sold_to_client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['sold_to_client_id']);
            $table->dropColumn(['sold_to_client_id', 'sold_at']);
        });
    }
};


