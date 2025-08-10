<?php

namespace App\Console\Commands;

use App\Services\ViewingService;
use Illuminate\Console\Command;

class MarkMeetingsAsMet extends Command
{
    protected $signature = 'deals:mark-met';

    protected $description = 'Mark deals step_met_at for viewings whose end time has passed';

    public function handle(ViewingService $service): int
    {
        $updated = $service->markElapsedMeetingsAsMet();
        $this->info("Updated {$updated} deals as met.");
        return self::SUCCESS;
    }
}


