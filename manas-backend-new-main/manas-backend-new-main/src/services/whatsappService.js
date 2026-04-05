const axios = require('axios');

const getHeaders = () => {
    if (!process.env.META_WA_ACCESS_TOKEN) {
        throw new Error('Meta WhatsApp Access Token missing. Set META_WA_ACCESS_TOKEN in .env');
    }
    return {
        'Authorization': `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };
};

const getUrl = () => {
    if (!process.env.META_WA_PHONE_NUMBER_ID) {
        throw new Error('Meta WhatsApp Phone Number ID missing. Set META_WA_PHONE_NUMBER_ID in .env');
    }
    return `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`;
};

const sendOTPWhatsApp = async (phoneNumber, otp) => {
    try {
        const url = getUrl();
        const headers = getHeaders();

        // Ensure phone number starts with country code, remove '+' if present
        // Adjust based on your region logic, Meta expects country code without +
        let formattedPhone = phoneNumber.replace(/\+/g, ''); // Simple cleanup

        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedPhone,
            type: 'template',
            template: {
                name: 'auth_otp', // Using the template name agreed upon
                language: {
                    code: 'en' // or en_US, make sure it matches the template
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: otp
                            }
                        ]
                    },
                    {
                        type: 'button',
                        sub_type: 'url',
                        index: 0,
                        parameters: [
                            {
                                type: 'text',
                                text: otp
                            }
                        ]
                    }
                ]
            }
        };

        console.log(`Sending WhatsApp OTP to ${formattedPhone}...`);
        const response = await axios.post(url, data, { headers });

        console.log('WhatsApp OTP sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp OTP:', error.response ? error.response.data : error.message);

        // Fallback? 
        // If template "auth_otp" doesn't exist, this will fail.
        // We strictly need the user to have this template. 
        // Constructive error message for the logs:
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Meta API Error Details:', JSON.stringify(error.response.data.error, null, 2));
        }

        throw new Error('Failed to send WhatsApp OTP');
    }
};

const sendWhatsAppMessage = async (phoneNumber, text) => {
    // Basic text message (only works if 24h window is open or using templates)
    // For general notifications, templates are safer.
    // Implementing text for testing/debug or active sessions.
    try {
        const url = getUrl();
        const headers = getHeaders();
        let formattedPhone = phoneNumber.replace(/\+/g, '');

        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedPhone,
            type: 'text',
            text: {
                preview_url: false,
                body: text
            }
        };

        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = {
    sendOTPWhatsApp,
    sendWhatsAppMessage
};
