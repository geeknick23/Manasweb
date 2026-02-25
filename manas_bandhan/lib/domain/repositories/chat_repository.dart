import '../../data/models/chat_message_model.dart'; // We'll create this model next

abstract class ChatRepository {
  Future<void> connect(String token);
  Future<void> disconnect();
  Future<void> sendMessage(String receiverId, String content);
  Future<List<ChatMessage>> getChatHistory(String otherUserId);
  Stream<ChatMessage> get messageStream;
}
