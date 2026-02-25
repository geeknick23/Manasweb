import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_theme.dart';
import '../../blocs/chat/chat_bloc.dart';
import '../../../core/di/injection_container.dart' as di;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/constants/constants.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../../domain/repositories/user_repository.dart';

class ChatScreen extends StatelessWidget {
  final String userId;
  final String userName;
  final String userImage;

  const ChatScreen({
    super.key,
    required this.userId,
    required this.userName,
    required this.userImage,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        // Retrieve token from SharedPreferences via GetIt
        final prefs = di.sl<SharedPreferences>();
        final token = prefs.getString(AppConstants.tokenKey);
        // Or trigger connection inside Bloc if token is passed or retrieved from repo
        
        final bloc = di.sl<ChatBloc>();
        // We need to connect first. 
        // Note: For production, Connection management should likely be global (e.g. HomeBloc or a dedicated ConnectionBloc)
        // But for this screen-scoped chat, we connect on enter and disconnect on exit for simplicity, OR
        // we assume a singleton service is already connected.
        // Let's pass the token to connect:
        if (token != null) {
          bloc.add(ConnectChat(token));
        }
        bloc.add(LoadChatHistory(userId));
        return bloc;
      },
      child: _ChatView(userName: userName, userImage: userImage, receiverId: userId),
    );
  }
}

class _ChatView extends StatefulWidget {
  final String userName;
  final String userImage;
  final String receiverId;

  const _ChatView({
    required this.userName,
    required this.userImage,
    required this.receiverId,
  });

  @override
  State<_ChatView> createState() => _ChatViewState();
}

class _ChatViewState extends State<_ChatView> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundImage: widget.userImage.startsWith('http') 
                  ? NetworkImage(widget.userImage) 
                  : AssetImage(widget.userImage) as ImageProvider,
              radius: 16,
            ),
            const SizedBox(width: 10),
            Text(widget.userName, style: const TextStyle(fontSize: 16)),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'report') {
                _showReportDialog(context);
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem<String>(
                  value: 'report',
                  child: Row(
                    children: [
                      Icon(Icons.flag, color: AppColors.error),
                      SizedBox(width: 8),
                      Text('Report User', style: TextStyle(color: AppColors.error)),
                    ],
                  ),
                ),
              ];
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: BlocConsumer<ChatBloc, ChatState>(
              listener: (context, state) {
                if (state is ChatReady) {
                  // Scroll to bottom on new message
                  WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
                }
              },
              builder: (context, state) {
                if (state is ChatLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                if (state is ChatError) {
                   return Center(child: Text("Error: ${state.message}"));
                }

                if (state is ChatReady) {
                  final messages = state.messages;
                  
                  if (messages.isEmpty) {
                    return const Center(child: Text("No messages yet. Say hi!"));
                  }

                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      final isMe = msg.isMe;
                      final localTime = msg.timestamp.toLocal();

                      // Check if we need a date separator
                      bool showDateSeparator = false;
                      if (index == 0) {
                        showDateSeparator = true;
                      } else {
                        final prevLocal = messages[index - 1].timestamp.toLocal();
                        if (localTime.year != prevLocal.year ||
                            localTime.month != prevLocal.month ||
                            localTime.day != prevLocal.day) {
                          showDateSeparator = true;
                        }
                      }

                      return Column(
                        children: [
                          if (showDateSeparator)
                            _buildDateSeparator(localTime),
                          Align(
                            alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.symmetric(vertical: 4),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                              decoration: BoxDecoration(
                                color: isMe ? AppColors.primary : Colors.grey.shade200,
                                borderRadius: BorderRadius.only(
                                  topLeft: const Radius.circular(16),
                                  topRight: const Radius.circular(16),
                                  bottomLeft: isMe ? const Radius.circular(16) : Radius.zero,
                                  bottomRight: isMe ? Radius.zero : const Radius.circular(16),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    msg.content,
                                    style: TextStyle(color: isMe ? Colors.white : Colors.black87),
                                  ),
                                  const SizedBox(height: 4),
                                  Builder(
                                    builder: (context) {
                                      final hour = localTime.hour % 12 == 0 ? 12 : localTime.hour % 12;
                                      final amPm = localTime.hour >= 12 ? 'PM' : 'AM';
                                      return Text(
                                        "$hour:${localTime.minute.toString().padLeft(2, '0')} $amPm",
                                        style: TextStyle(
                                          fontSize: 10, 
                                          color: isMe ? Colors.white.withOpacity(0.7) : Colors.black54
                                        ),
                                      );
                                    },
                                  )
                                ],
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  );
                }
                
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      fillColor: Colors.grey.shade100,
                      filled: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: () {
                      if (_controller.text.isNotEmpty) {
                        context.read<ChatBloc>().add(SendMessage(widget.receiverId, _controller.text));
                        _controller.clear();
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSeparator(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final messageDate = DateTime(date.year, date.month, date.day);

    String label;
    if (messageDate == today) {
      label = 'Today';
    } else if (messageDate == yesterday) {
      label = 'Yesterday';
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      label = '${date.day} ${months[date.month - 1]} ${date.year}';
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            label,
            style: const TextStyle(fontSize: 12, color: Colors.black54, fontWeight: FontWeight.w500),
          ),
        ),
      ),
    );
  }

  void _showReportDialog(BuildContext context) {
    String selectedReason = 'Spam';
    final TextEditingController descriptionController = TextEditingController();
    final List<String> reasons = ['Spam', 'Inappropriate Content', 'Harassment', 'Fake Profile', 'Other'];

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Report User'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButton<String>(
                    value: selectedReason,
                    isExpanded: true,
                    onChanged: (String? newValue) {
                      setState(() {
                        selectedReason = newValue!;
                      });
                    },
                    items: reasons.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: descriptionController,
                    decoration: const InputDecoration(
                      hintText: 'Additional details (optional)',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                ],
              ),
              actions: [
                TextButton(
                  child: const Text('Cancel'),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                TextButton(
                  child: const Text('Submit'),
                  onPressed: () async {
                    Navigator.of(context).pop();
                    try {
                      final repo = di.sl<UserRepository>();
                      await repo.reportUser(
                        userId: widget.receiverId,
                        reason: selectedReason,
                        description: descriptionController.text,
                      );
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Report submitted successfully.')),
                        );
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to submit report: $e')),
                        );
                      }
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }
}
