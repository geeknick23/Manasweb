class ChatMessage {
  final String id;
  final String senderId;
  final String receiverId;
  final String content;
  final DateTime timestamp;
  final bool isMe; // Helper for UI

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.content,
    required this.timestamp,
    required this.isMe,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json, String currentUserId) {
    final senderId = (json['sender'] is Map) ? (json['sender']['_id'] ?? '') : (json['sender'] ?? '');
    return ChatMessage(
      id: json['_id'] ?? '',
      senderId: senderId,
      receiverId: (json['receiver'] is Map) ? (json['receiver']['_id'] ?? '') : (json['receiver'] ?? ''),
      content: json['content'] ?? '',
      timestamp: DateTime.parse(json['createdAt']),
      isMe: senderId == currentUserId,
    );
  }
}
