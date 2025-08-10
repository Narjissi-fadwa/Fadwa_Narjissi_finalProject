# Fadwa_Narjissi_finalProject

## Development

1. Install PHP dependencies: `composer install`
2. Setup `.env` and generate key: `cp .env.example .env && php artisan key:generate`
3. Install frontend deps: `npm install`
4. Build assets: `npm run dev`
5. Run migrations and seeders: `php artisan migrate --seed`

### New: Property browsing and viewing bookings

- Public browsing routes:
  - GET `/properties` → list active, approved properties
  - GET `/properties/{property}` → show property detail with calendar
- Viewing API:
  - GET `/properties/{property}/viewings?start=ISO&end=ISO`
  - POST `/properties/{property}/viewings` (auth: client/admin)
  - GET `/owners/{owner}/calendar?start=ISO&end=ISO` (auth: owner/admin)

Install additional frontend packages for calendars:

```bash
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list
```

Run migrations:

```bash
php artisan migrate
```

Example requests:

```bash
# List property viewings within range
curl "http://localhost:8000/properties/1/viewings?start=2025-08-10T00:00:00Z&end=2025-08-31T23:59:59Z" \
  -H 'Accept: application/json'

# Create a viewing (client/admin auth required)
curl -X POST "http://localhost:8000/properties/1/viewings" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --cookie "laravel_session=..." \
  -d '{"start_at":"2025-08-12T10:00:00Z","end_at":"2025-08-12T10:30:00Z","notes":"Please confirm."}'

# Owner calendar events
curl "http://localhost:8000/owners/1/calendar?start=2025-08-01T00:00:00Z&end=2025-08-31T23:59:59Z" \
  -H 'Accept: application/json'
```

# test
# Fadwa_Narjissi_finalProject
# Fadwa_Narjissi_finalProject
