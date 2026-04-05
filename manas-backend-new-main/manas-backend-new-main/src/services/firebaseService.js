const admin = require('firebase-admin');

let db = null;

/**
 * Initialize Firebase Admin SDK
 * Expects either FIREBASE_SERVICE_ACCOUNT env var (JSON string) 
 * or GOOGLE_APPLICATION_CREDENTIALS env var (path to service account file)
 */
const initializeFirebase = () => {
    if (db) return db;

    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Parse from environment variable (for Vercel/cloud deployment)
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Use file path (for local development)
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        } else {
            console.warn('Firebase credentials not configured. Chat real-time features will be unavailable.');
            return null;
        }

        db = admin.database();
        console.log('Firebase Admin SDK initialized successfully');
        return db;
    } catch (error) {
        console.error('Failed to initialize Firebase:', error.message);
        return null;
    }
};

/**
 * Generate a consistent chat room ID from two user IDs
 * Always produces the same ID regardless of who is sender/receiver
 */
const getChatRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
};

/**
 * Write a message to Firebase Realtime Database
 */
const writeMessage = async (senderId, receiverId, content, senderName) => {
    const database = initializeFirebase();
    if (!database) {
        console.warn('Firebase not initialized, skipping real-time write');
        return null;
    }

    const chatRoomId = getChatRoomId(senderId, receiverId);
    const messageRef = database.ref(`chats/${chatRoomId}/messages`).push();

    const messageData = {
        _id: messageRef.key,
        sender: senderId,
        senderName: senderName || 'Someone',
        receiver: receiverId,
        content: content,
        createdAt: new Date().toISOString(),
        isRead: false
    };

    await messageRef.set(messageData);

    // Update chat room metadata (last message, timestamp)
    await database.ref(`chats/${chatRoomId}/metadata`).update({
        lastMessage: content.substring(0, 50), // Preview only
        lastMessageAt: messageData.createdAt,
        participants: { [senderId]: true, [receiverId]: true }
    });

    return messageData;
};

/**
 * Get Firebase database reference (for direct access if needed)
 */
const getDatabase = () => {
    return initializeFirebase();
};

module.exports = {
    initializeFirebase,
    getChatRoomId,
    writeMessage,
    getDatabase
};
