# SCHEMA

## Tables / Collections (Firebase)
- `users` (id, google_id, email, created_at)
- `workouts` (id, user_id, type [gym|cardio], duration_sec, date)
- `location_tracks` (id, workout_id, lat, lng, timestamp)
