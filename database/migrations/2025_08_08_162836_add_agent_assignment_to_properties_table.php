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
            // Add agent assignment and approval workflow
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('rejection_reason')->nullable();

            // Update existing status enum to include 'pending' for new workflow
            $table->enum('status', ['pending', 'active', 'inactive', 'sold', 'rented'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['assigned_agent_id']);
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'assigned_agent_id',
                'approval_status',
                'approved_at',
                'approved_by',
                'rejection_reason'
            ]);

            // Revert status enum to original
            $table->enum('status', ['active', 'inactive', 'sold', 'rented'])->default('active')->change();
        });
    }
};
