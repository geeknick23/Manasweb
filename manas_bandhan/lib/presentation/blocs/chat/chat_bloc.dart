import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../domain/repositories/chat_repository.dart';
import '../../../data/models/chat_message_model.dart';

// Events
abstract class ChatEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class ConnectChat extends ChatEvent {
  final String token;
  ConnectChat(this.token);
}

class DisconnectChat extends ChatEvent {}

class LoadChatHistory extends ChatEvent {
  final String otherUserId;
  LoadChatHistory(this.otherUserId);
}

class SendMessage extends ChatEvent {
  final String receiverId;
  final String content;
  SendMessage(this.receiverId, this.content);
}

class ReceiveMessage extends ChatEvent {
  final ChatMessage message;
  ReceiveMessage(this.message);
}

// States
abstract class ChatState extends Equatable {
  @override
  List<Object> get props => [];
}

class ChatInitial extends ChatState {}

class ChatLoading extends ChatState {}

class ChatReady extends ChatState {
  final List<ChatMessage> messages;
  final String? error;

  ChatReady(this.messages, {this.error});

  @override
  List<Object> get props => [messages, if (error != null) error!];
}

class ChatError extends ChatState {
  final String message;
  ChatError(this.message);
}

// Bloc
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ChatRepository _chatRepository;

  ChatBloc(this._chatRepository) : super(ChatInitial()) {
    on<ConnectChat>(_onConnect);
    on<DisconnectChat>(_onDisconnect);
    on<LoadChatHistory>(_onLoadHistory);
    on<SendMessage>(_onSendMessage);
    on<ReceiveMessage>(_onReceiveMessage);

    // Subscribe to stream
    _chatRepository.messageStream.listen((message) {
      add(ReceiveMessage(message));
    });
  }

  Future<void> _onConnect(ConnectChat event, Emitter<ChatState> emit) async {
    await _chatRepository.connect(event.token);
  }

  Future<void> _onDisconnect(DisconnectChat event, Emitter<ChatState> emit) async {
    await _chatRepository.disconnect();
  }

  Future<void> _onLoadHistory(LoadChatHistory event, Emitter<ChatState> emit) async {
    emit(ChatLoading());
    try {
      final messages = await _chatRepository.getChatHistory(event.otherUserId);
      emit(ChatReady(messages));
    } catch (e) {
      emit(ChatError("Failed to load history"));
    }
  }

  Future<void> _onSendMessage(SendMessage event, Emitter<ChatState> emit) async {
    try {
      await _chatRepository.sendMessage(event.receiverId, event.content);
      // Wait for 'messageSent' confirmation stream to update list
    } catch (e) {
      if (state is ChatReady) {
        emit(ChatReady((state as ChatReady).messages, error: "Failed to send"));
      }
    }
  }

  void _onReceiveMessage(ReceiveMessage event, Emitter<ChatState> emit) {
    if (state is ChatReady) {
      final currentList = List<ChatMessage>.from((state as ChatReady).messages);
      // Prevent duplicates by checking if message ID already exists
      final alreadyExists = currentList.any((m) => m.id == event.message.id);
      if (!alreadyExists) {
        currentList.add(event.message);
        emit(ChatReady(currentList));
      }
    } else {
      // If we receive a message before history loads (rare but possible)
      emit(ChatReady([event.message]));
    }
  }
  
  @override
  Future<void> close() {
    _chatRepository.disconnect();
    return super.close();
  }
}
