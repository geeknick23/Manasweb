import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../datasources/api_client.dart';
import '../../core/constants/constants.dart';
import '../../domain/repositories/chat_repository.dart';
import '../models/chat_message_model.dart';
import '../services/chat_service.dart';
import '../../domain/repositories/user_repository.dart';
import '../services/notification_service.dart';

class ChatRepositoryImpl implements ChatRepository {
  final ChatService _chatService;
  final ApiClient _apiClient;
  final UserRepository _userRepository;
  final NotificationService _notificationService;

  final _messageController = StreamController<ChatMessage>.broadcast();
  String? _authToken;
  String? _currentUserId;

  ChatRepositoryImpl(this._chatService, this._apiClient, this._userRepository, this._notificationService);

  @override
  Stream<ChatMessage> get messageStream => _messageController.stream;

  @override
  Future<void> connect(String token) async {
    _authToken = token;
    _chatService.connect(token);
    
    // Get current user ID for Firebase room subscriptions
    try {
      final currentUser = await _userRepository.getProfile();
      _currentUserId = currentUser.id;
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[Chat] Error getting current user for Firebase connection: $e');
      }
    }

    // Set up message callbacks
    _chatService.onMessageReceived = (data) async {
      try {
        final currentUser = await _userRepository.getProfile();
        final message = ChatMessage.fromJson(Map<String, dynamic>.from(data), currentUser.id);
        _messageController.add(message);

        // Show notification for received messages
        if (!message.isMe) {
          _notificationService.showNotification(
            id: message.senderId.hashCode,
            title: data['senderName'] ?? 'New Message',
            body: message.content,
            payload: message.senderId,
          );
        }
      } catch (e) {
        if (kDebugMode) {
          debugPrint('[Chat] Error processing received message: $e');
        }
      }
    };

    _chatService.onMessageSentConfirmation = (data) async {
      try {
        final currentUser = await _userRepository.getProfile();
        final message = ChatMessage.fromJson(Map<String, dynamic>.from(data), currentUser.id);
        _messageController.add(message);
      } catch (e) {
        if (kDebugMode) {
          debugPrint('[Chat] Error processing sent message confirmation: $e');
        }
      }
    };
  }

  @override
  Future<void> disconnect() async {
    _chatService.disconnect();
    _currentUserId = null;
  }

  @override
  Future<void> sendMessage(String receiverId, String content) async {
    await _chatService.sendMessage(receiverId, content);
  }

  /// Start listening to a specific chat room (call when opening a chat screen)
  void startListeningToChat(String otherUserId) {
    if (_currentUserId != null) {
      _chatService.listenToChat(_currentUserId!, otherUserId);
    }
  }

  /// Stop listening to a specific chat room (call when leaving a chat screen)
  void stopListeningToChat(String otherUserId) {
    if (_currentUserId != null) {
      _chatService.stopListening(_currentUserId!, otherUserId);
    }
  }

  @override
  Future<List<ChatMessage>> getChatHistory(String otherUserId) async {
    try {
      if (_authToken == null) throw Exception('Not connected or no token');

      final currentUser = await _userRepository.getProfile();

      // Start listening to this chat room for real-time updates
      if (_currentUserId != null) {
        _chatService.listenToChat(_currentUserId!, otherUserId);
      }
      
      final response = await _apiClient.get(
        '${ApiConstants.baseUrl}/api/chat/history/$otherUserId',
        options: Options(headers: {'Authorization': 'Bearer $_authToken'}),
      );

      final List<dynamic> data = response.data;
      return data.map((json) => ChatMessage.fromJson(json, currentUser.id)).toList();
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[Chat] Error fetching chat history: $e');
      }
      return [];
    }
  }
}
