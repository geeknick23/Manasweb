import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';

import 'app.dart';
import 'core/di/injection_container.dart' as di;
import 'data/services/notification_service.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Initialize dependencies
  await di.init();
  
  // Initialize notifications
  final notificationService = di.sl<NotificationService>();
  await notificationService.init();
  
  // Set up notification tap handler
  notificationService.onNotificationTap = (payload) {
    if (payload == null) return;
    
    // Navigate based on payload
    if (payload.startsWith('interest_')) {
      navigatorKey.currentState?.pushNamed('/interests');
    } else if (payload.startsWith('match_')) {
      navigatorKey.currentState?.pushNamed('/matches');
    } else {
      // Assume it's a user ID for chat
      navigatorKey.currentState?.pushNamed('/chat', arguments: {
        'userId': payload,
        'name': 'Chat',
      });
    }
  };
  
  runApp(const ManasBandhanApp());
}
