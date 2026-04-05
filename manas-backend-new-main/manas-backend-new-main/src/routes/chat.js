const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Message = require('../models/Message');
const { decrypt } = require('../lib/encryption');
const { sendMessage } = require('../controllers/chatController');

// Send a message (REST replacement for Socket.IO)
router.post('/send', authenticate, sendMessage);

// Get chat history with a specific user
router.get('/history/:otherUserId', authenticate, async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { otherUserId } = req.params;

        // Fetch messages between these two users, sorted by time
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        const decryptedMessages = messages.reduce((acc, msg) => {
            try {
                const plainText = decrypt({ content: msg.content, iv: msg.iv, salt: msg.salt });

                if (!plainText || plainText.startsWith('Error:')) {
                    console.warn(`Skipping un-decryptable message ${msg._id}`);
                    return acc;
                }

                acc.push({
                    _id: msg._id,
                    sender: msg.sender,
                    receiver: msg.receiver,
                    content: plainText,
                    createdAt: msg.createdAt,
                    isRead: msg.isRead
                });
            } catch (e) {
                console.error(`Failed to process message ${msg._id}:`, e.message);
            }
            return acc;
        }, []);

        res.json(decryptedMessages);
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

module.exports = router;
