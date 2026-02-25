import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:dio/dio.dart';
import '../../core/constants/constants.dart';

class ChatService {
  final FirebaseDatabase _database = FirebaseDatabase.instance;
  final Dio _dio = Dio();
  
  final Map<String, StreamSubscription> _subscriptions = {};
  String? _authToken;

  // Callbacks for UI updates
  Function(dynamic)? onMessageReceived;
  Function(dynamic)? onMessageSentConfirmation;

  /// Generate consistent chat room ID from two user IDs
  String _getChatRoomId(String userId1, String userId2) {
    final ids = [userId1, userId2]..sort();
    return ids.join('_');
  }

  /// Connect and start listening for messages
  void connect(String token) {
    _authToken = token;
    if (kDebugMode) {
      debugPrint('[ChatService] Connected with token, ready to listen');
    }
  }

  /// Start listening to a specific chat room for real-time messages
  void listenToChat(String currentUserId, String otherUserId) {
    final chatRoomId = _getChatRoomId(currentUserId, otherUserId);
    
    // Don't duplicate listeners
    if (_subscriptions.containsKey(chatRoomId)) return;

    final ref = _database.ref('chats/$chatRoomId/messages');
    
    // Only listen for new messages (added after subscription)
    final subscription = ref.orderByChild('createdAt').onChildAdded.listen((event) {
      if (event.snapshot.value != null) {
        final data = Map<String, dynamic>.from(event.snapshot.value as Map);
        data['_id'] = data['_id'] ?? event.snapshot.key;
        
        if (kDebugMode) {
          debugPrint('[ChatService] New message received from Firebase');
        }

        // Determine if this is my message or received message
        if (data['sender'] == currentUserId) {
          if (onMessageSentConfirmation != null) {
            onMessageSentConfirmation!(data);
          }
        } else {
          if (onMessageReceived != null) {
            onMessageReceived!(data);
          }
        }
      }
    }, onError: (error) {
      if (kDebugMode) {
        debugPrint('[ChatService] Firebase listen error: $error');
      }
    });

    _subscriptions[chatRoomId] = subscription;
  }

  /// Send a message via REST API (backend saves to MongoDB + Firebase)
  Future<void> sendMessage(String receiverId, String content) async {
    if (_authToken == null) {
      if (kDebugMode) {
        debugPrint('[ChatService] Not connected. Cannot send message.');
      }
      return;
    }

    try {
      await _dio.post(
        '${ApiConstants.baseUrl}/api/chat/send',
        data: {
          'receiverId': receiverId,
          'content': content,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $_authToken',
            'Content-Type': 'application/json',
          },
        ),
      );
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[ChatService] Error sending message: $e');
      }
      rethrow;
    }
  }

  /// Stop listening to a specific chat room
  void stopListening(String currentUserId, String otherUserId) {
    final chatRoomId = _getChatRoomId(currentUserId, otherUserId);
    _subscriptions[chatRoomId]?.cancel();
    _subscriptions.remove(chatRoomId);
  }

  /// Disconnect and cancel all listeners
  void disconnect() {
    for (final sub in _subscriptions.values) {
      sub.cancel();
    }
    _subscriptions.clear();
    _authToken = null;
    if (kDebugMode) {
      debugPrint('[ChatService] Disconnected, all listeners cancelled');
    }
  }
}
