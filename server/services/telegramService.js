const axios = require('axios');
const fs = require('fs');
const path = require('path');

class TelegramService {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.enabled = process.env.TELEGRAM_ENABLED === 'true';

        // Base URL for Telegram Bot API
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;

        // Log file path
        this.logFile = path.join(__dirname, '../logs/notifications.log');

        if (this.enabled && (!this.botToken || !this.chatId)) {
            console.warn('⚠️ Telegram notifications enabled but missing configuration!');
            this.enabled = false;
        }
    }

    /**
     * Check if Telegram notifications are enabled
     * @returns {boolean}
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Log notification event to file
     * @param {string} status - 'success' or 'failed'
     * @param {object} details - Event details
     */
    logEvent(status, details) {
        const timestamp = new Date().toISOString();
        const logEntry = JSON.stringify({ timestamp, status, ...details }) + '\n';

        fs.appendFile(this.logFile, logEntry, (err) => {
            if (err) console.error('Error writing to notification log:', err);
        });
    }

    /**
     * Send an inquiry notification
     * @param {object} inquiry - Inquiry details
     * @param {object} car - Car details
     * @param {object} user - User details
     */
    async sendInquiryNotification(inquiry, car, user) {
        if (!this.isEnabled()) return;

        const message = this.formatInquiryMessage(inquiry, car, user);
        await this.sendMessage(message, {
            parse_mode: 'HTML',
            metadata: { inquiryId: inquiry.id, type: 'inquiry_notification' }
        });
    }

    /**
     * Format inquiry message
     * @param {object} inquiry
     * @param {object} car
     * @param {object} user
     * @returns {string}
     */
    formatInquiryMessage(inquiry, car, user) {
        const { type, message, requestedDate, createdAt } = inquiry;
        const date = new Date(createdAt || Date.now()).toLocaleString();

        // Ensure formatting doesn't break if description is long
        const shortMessage = message && message.length > 500 ? message.substring(0, 497) + '...' : message;

        return `
📨 <b>New Inquiry Received</b>

<b>Type:</b> ${type}
<b>Date:</b> ${date}

<b>Car:</b> ${car?.title || 'Unknown'} (${car?.brand} ${car?.model})
<b>Price:</b> $${(car?.price || 0).toLocaleString()}

<b>From:</b> ${user?.name || 'Anonymous'}
<b>Contact:</b> ${user?.email}

<b>Message:</b>
<i>"${shortMessage || 'No message'}"</i>

${requestedDate ? `<b>Requested Date:</b> ${new Date(requestedDate).toLocaleDateString()}` : ''}
`.trim();
    }

    /**
     * Send a payment notification
     * @param {object} orderDetails - Order details object
     */
    async sendPaymentNotification(orderDetails) {
        if (!this.isEnabled()) return;

        const message = this.formatPaymentMessage(orderDetails);
        await this.sendMessage(message, {
            parse_mode: 'HTML',
            metadata: { orderId: orderDetails.id, type: 'payment_notification' }
        });
    }

    /**
     * Format payment message
     * @param {object} order - Order details including car, buyer, seller
     * @returns {string} - Formatted message
     */
    formatPaymentMessage(order) {
        const { id, finalPrice, status, createdAt, car, buyer, seller } = order;

        // Format currency
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(finalPrice);

        // Format date
        const date = new Date(createdAt).toLocaleString();

        return `
🚗 <b>New Car Purchase!</b>

<b>Car:</b> ${car?.title || 'Unknown Car'} (${car?.brand} ${car?.model})
<b>Price:</b> ${formattedPrice}

<b>Buyer:</b> ${buyer?.name} (${buyer?.email})
<b>Seller:</b> ${seller?.name} (${seller?.email})

<b>Order ID:</b> #${id}
<b>Status:</b> ${status}
<b>Time:</b> ${date}
    `.trim();
    }

    /**
     * Send a message to the configured chat
     * @param {string} text - Message text
     * @param {object} options - Additional options including metadata
     */
    async sendMessage(text, options = {}) {
        if (!this.isEnabled()) return;

        const { metadata, ...apiOptions } = options;

        const payload = {
            chat_id: this.chatId,
            text,
            ...apiOptions,
        };

        // Retry logic with exponential backoff
        let retries = 3;
        let delay = 1000;

        while (retries > 0) {
            try {
                await axios.post(`${this.baseUrl}/sendMessage`, payload);
                console.log(`✅ Telegram notification sent for message: "${text.substring(0, 50)}..."`);

                this.logEvent('success', {
                    messageId: text.substring(0, 20),
                    ...metadata
                });
                return;
            } catch (error) {
                console.error(`❌ Telegram send error (attempts left: ${retries - 1}):`, error.message);

                if (error.response) {
                    console.error('Data:', error.response.data);
                }

                retries--;
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    console.error('❌ Failed to send Telegram notification after all retries');

                    this.logEvent('failed', {
                        error: error.message,
                        ...metadata
                    });
                }
            }
        }
    }
}

// Export singleton instance
const telegramService = new TelegramService();
module.exports = telegramService;
