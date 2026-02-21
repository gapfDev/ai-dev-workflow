# TECHNICAL STRATEGY

## 1. Architecture
- **Paradigm**: TDD Mobile (JUnit + Espresso).
- **Frontend App**: Android Native (Kotlin) with Jetpack Compose.
- **Backend/Services**: Firebase (for Google Auth and syncing).
- **Location Services**: Google Play Services Location API.

## 2. Mitigations
- Abstracted GPS provider for testability on emulators.

## 3. Testing
- Mocked LocationManager for TDD validations.
