# Manas Bandhan

A Flutter mobile application for the MANAS Foundation - a matrimonial platform for widows and divorcees in the Vidarbha region of Maharashtra.

## Features

- **NGO Information Hub**: About Us, Projects, Donate, Contact
- **Matchmaking Platform**: Profile creation, discovery, and interest system
- **Multilingual**: Marathi and English support
- **Offline-first**: Local caching for rural connectivity

## Getting Started

1. **Install dependencies:**
```bash
flutter pub get
```

2. **Run the app:**
```bash
flutter run
```

3. **Build APK:**
```bash
flutter build apk --release
```

## Project Structure

```
lib/
├── core/           # Constants, theme, localization
├── data/           # Models, repositories, data sources
├── domain/         # Business logic, repository interfaces
└── presentation/   # BLoCs, screens, widgets
```

## Backend Integration

This app connects to the existing Express.js backend. Update the API URL in `lib/core/constants/constants.dart`:

```dart
static const String baseUrl = 'http://your-backend-url:5000';
```

## Tech Stack

- Flutter (Dart)
- BLoC State Management
- Dio for HTTP
- SharedPreferences for local storage
- Isar for offline database (to be implemented)

## License

MIT - MANAS Foundation
