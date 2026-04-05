const crypto = require('crypto');

// CRITICAL: MESSAGE_SECRET must be set in production. No fallback.
const ENCRYPTION_KEY = process.env.MESSAGE_SECRET;
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 16; // Salt for key derivation

if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: MESSAGE_SECRET environment variable must be set in production!');
}

// Fallback for development only
const getEncryptionKey = () => {
    if (ENCRYPTION_KEY) return ENCRYPTION_KEY;
    if (process.env.NODE_ENV !== 'production') {
        console.warn('WARNING: Using insecure default encryption key. Set MESSAGE_SECRET in production!');
        return 'manas_dev_key_do_not_use_in_prod';
    }
    throw new Error('MESSAGE_SECRET is required');
};

function encrypt(text) {
    if (!text) return null;
    
    // Generate a random salt for each encryption
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.scryptSync(getEncryptionKey(), salt, 32);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'), // Store salt with the encrypted data
        content: encrypted.toString('hex')
    };
}

function decrypt(text) {
    if (!text || !text.content || !text.iv) return null;

    try {
        // Use stored salt, or fallback to old 'salt' string for backwards compatibility
        const salt = text.salt ? Buffer.from(text.salt, 'hex') : 'salt';
        const key = crypto.scryptSync(getEncryptionKey(), salt, 32);
        const iv = Buffer.from(text.iv, 'hex');
        const encryptedText = Buffer.from(text.content, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return 'Error: Could not decrypt message';
    }
}

module.exports = { encrypt, decrypt };
