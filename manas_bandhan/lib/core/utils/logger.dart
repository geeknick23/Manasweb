import 'package:flutter/foundation.dart';

/// App Logger - Only logs in debug mode
/// In release builds, all logs are no-ops for performance
class AppLogger {
  static void debug(String message, {String? tag}) {
    if (kDebugMode) {
      final prefix = tag != null ? '[$tag] ' : '';
      debugPrint('$prefix$message');
    }
  }

  static void error(String message, {Object? error, StackTrace? stackTrace, String? tag}) {
    if (kDebugMode) {
      final prefix = tag != null ? '[$tag] ' : '';
      debugPrint('$prefix ERROR: $message');
      if (error != null) {
        debugPrint('$prefix Error details: $error');
      }
      if (stackTrace != null) {
        debugPrint('$prefix Stack trace: $stackTrace');
      }
    }
  }

  static void info(String message, {String? tag}) {
    if (kDebugMode) {
      final prefix = tag != null ? '[$tag] ' : '';
      debugPrint('$prefix INFO: $message');
    }
  }

  static void warning(String message, {String? tag}) {
    if (kDebugMode) {
      final prefix = tag != null ? '[$tag] ' : '';
      debugPrint('$prefix WARNING: $message');
    }
  }
}
