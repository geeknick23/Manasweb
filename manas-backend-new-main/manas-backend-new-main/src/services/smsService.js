const axios = require('axios');

/**
 * MSG91 OTP Service (uses MSG91's dedicated OTP API)
 * 
 * MSG91 handles OTP generation, delivery, verification, and retries.
 * No need for separate DLT template registration — MSG91 manages it.
 * 
 * Required .env variables:
 *   SMS_AUTH_KEY     - MSG91 auth key (from dashboard → Settings → Authkey)
 *   SMS_TEMPLATE_ID - MSG91 OTP template ID (from MSG91 dashboard → OTP → Templates)
 */

const MSG91_BASE = 'https://control.msg91.com/api/v5';

const getAuthKey = () => {
    if (!process.env.SMS_AUTH_KEY) {
        throw new Error('MSG91 Auth Key missing. Set SMS_AUTH_KEY in .env');
    }
    return process.env.SMS_AUTH_KEY;
};

/**
 * Format phone number to include country code.
 * Accepts: 9876543210, 919876543210, +919876543210
 * Returns: 919876543210
 */
const formatPhone = (phoneNumber) => {
    let phone = phoneNumber.replace(/[\s\-\+]/g, '');
    // If 10 digits, prepend 91 (India)
    if (phone.length === 10 && /^\d{10}$/.test(phone)) {
        phone = '91' + phone;
    }
    return phone;
};

/**
 * Send OTP via MSG91's OTP API
 * MSG91 generates the OTP itself and delivers it via SMS.
 * 
 * @param {string} phoneNumber - Phone number (with or without country code)
 * @returns {Promise<object>} MSG91 API response
 */
const sendOTP = async (phoneNumber) => {
    try {
        const mobile = formatPhone(phoneNumber);
        const templateId = process.env.SMS_TEMPLATE_ID;

        if (!templateId) {
            throw new Error('SMS_TEMPLATE_ID missing in .env. Create an OTP template in MSG91 dashboard.');
        }

        console.log(`[MSG91] Sending OTP to ${mobile}...`);

        const response = await axios.post(
            `${MSG91_BASE}/otp`,
            {
                template_id: templateId,
                mobile: mobile,
                otp_length: 6,
            },
            {
                headers: {
                    authkey: getAuthKey(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        );

        console.log('[MSG91] OTP sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('[MSG91] Error sending OTP:',
            error.response ? error.response.data : error.message
        );
        throw new Error('Failed to send SMS OTP. Please try again.');
    }
};

/**
 * Verify OTP via MSG91's OTP Verify API
 * MSG91 checks the OTP - we don't need to store it in our database.
 * 
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - The OTP code entered by user
 * @returns {Promise<object>} MSG91 API response
 */
const verifyOTP = async (phoneNumber, otp) => {
    try {
        const mobile = formatPhone(phoneNumber);

        console.log(`[MSG91] Verifying OTP for ${mobile}...`);

        const response = await axios.get(
            `${MSG91_BASE}/otp/verify`,
            {
                params: { mobile, otp },
                headers: {
                    authkey: getAuthKey(),
                    'Accept': 'application/json',
                }
            }
        );

        console.log('[MSG91] OTP verification result:', response.data);

        // MSG91 returns { type: 'success', message: 'OTP verified success' } on success
        if (response.data.type === 'error') {
            throw new Error(response.data.message || 'OTP verification failed');
        }

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error('[MSG91] Verify error:', error.response.data);
            throw new Error(error.response.data.message || 'Invalid or expired OTP');
        }
        throw error;
    }
};

/**
 * Resend OTP via MSG91
 * 
 * @param {string} phoneNumber - Phone number
 * @param {string} retryType - 'text' for SMS, 'voice' for voice call
 * @returns {Promise<object>} MSG91 API response
 */
const resendOTP = async (phoneNumber, retryType = 'text') => {
    try {
        const mobile = formatPhone(phoneNumber);

        console.log(`[MSG91] Resending OTP to ${mobile} via ${retryType}...`);

        const response = await axios.get(
            `${MSG91_BASE}/otp/retry`,
            {
                params: { mobile, retrytype: retryType },
                headers: {
                    authkey: getAuthKey(),
                    'Accept': 'application/json',
                }
            }
        );

        console.log('[MSG91] Resend result:', response.data);
        return response.data;
    } catch (error) {
        console.error('[MSG91] Resend error:',
            error.response ? error.response.data : error.message
        );
        throw new Error('Failed to resend OTP. Please try again.');
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP,
    formatPhone
};
