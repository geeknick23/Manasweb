const Message = require('../models/Message');
const { encrypt } = require('../lib/encryption');
const { writeMessage } = require('../services/firebaseService');
const { User } = require('../models/User');

/**
 * POST /api/chat/send
 * Send a message - saves encrypted to MongoDB (backup) and writes plaintext to Firebase (real-time)
 */
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id.toString();
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ message: 'receiverId and content are required' });
        }

        if (content.length > 5000) {
            return res.status(400).json({ message: 'Message too long (max 5000 characters)' });
        }

        // Get sender name for the message payload
        const senderUser = await User.findById(senderId).select('full_name');
        const senderName = senderUser ? senderUser.full_name : 'Someone';

        // 1. Encrypt and save to MongoDB (backup/history)
        const encryptedData = encrypt(content);
        if (!encryptedData) {
            return res.status(500).json({ message: 'Failed to process message' });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: encryptedData.content,
            iv: encryptedData.iv,
            salt: encryptedData.salt,
            createdAt: new Date()
        });

        await newMessage.save();

        // 2. Write to Firebase for real-time delivery
        let firebaseMessage = null;
        try {
            firebaseMessage = await writeMessage(senderId, receiverId, content, senderName);
        } catch (firebaseError) {
            console.error('Firebase write failed (message still saved to DB):', firebaseError.message);
            // Don't fail the request - message is saved in MongoDB
        }

        // 3. Send email notification (non-blocking)
        try {
            const receiverUser = await User.findById(receiverId).select('email');
            if (receiverUser && receiverUser.email) {
                const { sendNewMessageEmail } = require('../services/emailService');
                sendNewMessageEmail(senderName, receiverUser.email, content);
            }
        } catch (emailError) {
            console.error('Email notification failed:', emailError.message);
        }

        // 4. Return success with message data
        res.status(201).json({
            _id: firebaseMessage?._id || newMessage._id,
            sender: senderId,
            senderName: senderName,
            receiver: receiverId,
            content: content,
            createdAt: newMessage.createdAt
        });

    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { sendMessage };
