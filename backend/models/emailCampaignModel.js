import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recipientType: {
        type: String,
        enum: ['all', 'newsletter_subscribers', 'custom'],
        default: 'all'
    },
    customRecipients: [{
        type: String // email addresses
    }],
    totalRecipients: {
        type: Number,
        default: 0
    },
    sentCount: {
        type: Number,
        default: 0
    },
    failedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'sending', 'completed', 'failed'],
        default: 'draft'
    },
    sentBy: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const emailCampaignModel = mongoose.model('EmailCampaign', emailCampaignSchema);

export default emailCampaignModel; 