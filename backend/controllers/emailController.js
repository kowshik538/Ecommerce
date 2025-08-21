import userModel from '../models/userModel.js';
import emailTemplateModel from '../models/emailTemplateModel.js';
import emailCampaignModel from '../models/emailCampaignModel.js';
import { sendEmail } from '../utils/sendEmail.js';

// Get all users with their preferences
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password -resetOTP -resetOTPExpiry -cartData');
        
        const userStats = {
            total: users.length,
            newsletterSubscribers: users.filter(user => user.preferences?.newsletter).length,
            notificationEnabled: users.filter(user => user.preferences?.notifications).length,
            withProfilePhoto: users.filter(user => user.profilePhoto).length
        };

        res.json({
            success: true,
            users,
            stats: userStats
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get users by preference
const getUsersByPreference = async (req, res) => {
    try {
        const { preference } = req.query;
        
        let query = {};
        if (preference === 'newsletter') {
            query['preferences.newsletter'] = true;
        } else if (preference === 'notifications') {
            query['preferences.notifications'] = true;
        }

        const users = await userModel.find(query).select('-password -resetOTP -resetOTPExpiry -cartData');
        
        res.json({
            success: true,
            users,
            count: users.length
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Create email template
const createEmailTemplate = async (req, res) => {
    try {
        const { name, subject, content, type } = req.body;
        const createdBy = req.adminEmail || 'admin';

        const template = new emailTemplateModel({
            name,
            subject,
            content,
            type,
            createdBy
        });

        await template.save();

        res.json({
            success: true,
            message: 'Email template created successfully',
            template
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all email templates
const getEmailTemplates = async (req, res) => {
    try {
        const templates = await emailTemplateModel.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            templates
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update email template
const updateEmailTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const { name, subject, content, type, isActive } = req.body;

        const template = await emailTemplateModel.findByIdAndUpdate(
            templateId,
            {
                name,
                subject,
                content,
                type,
                isActive,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!template) {
            return res.json({ success: false, message: 'Template not found' });
        }

        res.json({
            success: true,
            message: 'Email template updated successfully',
            template
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete email template
const deleteEmailTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;

        const template = await emailTemplateModel.findByIdAndDelete(templateId);

        if (!template) {
            return res.json({ success: false, message: 'Template not found' });
        }

        res.json({
            success: true,
            message: 'Email template deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Send email campaign
const sendEmailCampaign = async (req, res) => {
    try {
        const { 
            name, 
            subject, 
            content, 
            recipientType, 
            customRecipients,
            templateId 
        } = req.body;

        const sentBy = req.adminEmail || 'admin';

        // Get recipients based on type
        let recipients = [];
        let totalRecipients = 0;

        if (recipientType === 'all') {
            const users = await userModel.find({}).select('email name');
            recipients = users.map(user => ({ email: user.email, name: user.name }));
            totalRecipients = users.length;
        } else if (recipientType === 'newsletter_subscribers') {
            const users = await userModel.find({ 'preferences.newsletter': true }).select('email name');
            recipients = users.map(user => ({ email: user.email, name: user.name }));
            totalRecipients = users.length;
        } else if (recipientType === 'notifications_enabled') {
            const users = await userModel.find({ 'preferences.notifications': true }).select('email name');
            recipients = users.map(user => ({ email: user.email, name: user.name }));
            totalRecipients = users.length;
        } else if (recipientType === 'custom' && customRecipients) {
            recipients = customRecipients.map(email => ({ email, name: email.split('@')[0] }));
            totalRecipients = customRecipients.length;
        }

        if (recipients.length === 0) {
            return res.json({ success: false, message: 'No recipients found for the selected criteria' });
        }

        // Create campaign record
        const campaign = new emailCampaignModel({
            name,
            subject,
            content,
            recipientType,
            customRecipients: recipientType === 'custom' ? customRecipients : [],
            totalRecipients,
            sentBy,
            status: 'sending'
        });

        await campaign.save();

        // Send emails in batches
        const batchSize = 10;
        let sentCount = 0;
        let failedCount = 0;

        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            
            const emailPromises = batch.map(async (recipient) => {
                try {
                    // Personalize content
                    let personalizedContent = content;
                    if (recipient.name) {
                        personalizedContent = content.replace(/{{name}}/g, recipient.name);
                    }

                    await sendEmail({
                        to: recipient.email,
                        subject: subject,
                        html: personalizedContent
                    });

                    sentCount++;
                    return { success: true, email: recipient.email };
                } catch (error) {
                    failedCount++;
                    console.error(`Failed to send email to ${recipient.email}:`, error);
                    return { success: false, email: recipient.email, error: error.message };
                }
            });

            await Promise.all(emailPromises);
            
            // Small delay between batches to avoid rate limiting
            if (i + batchSize < recipients.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Update campaign status
        campaign.sentCount = sentCount;
        campaign.failedCount = failedCount;
        campaign.status = 'completed';
        campaign.sentAt = Date.now();
        await campaign.save();

        res.json({
            success: true,
            message: `Email campaign sent successfully! Sent: ${sentCount}, Failed: ${failedCount}`,
            campaign: {
                id: campaign._id,
                name: campaign.name,
                totalRecipients: campaign.totalRecipients,
                sentCount: campaign.sentCount,
                failedCount: campaign.failedCount,
                status: campaign.status
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get email campaigns
const getEmailCampaigns = async (req, res) => {
    try {
        const campaigns = await emailCampaignModel.find({}).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            campaigns
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get campaign statistics
const getCampaignStats = async (req, res) => {
    try {
        const totalCampaigns = await emailCampaignModel.countDocuments();
        const completedCampaigns = await emailCampaignModel.countDocuments({ status: 'completed' });
        const totalEmailsSent = await emailCampaignModel.aggregate([
            { $group: { _id: null, total: { $sum: '$sentCount' } } }
        ]);

        const recentCampaigns = await emailCampaignModel.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalCampaigns,
                completedCampaigns,
                totalEmailsSent: totalEmailsSent[0]?.total || 0,
                recentCampaigns
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    getAllUsers,
    getUsersByPreference,
    createEmailTemplate,
    getEmailTemplates,
    updateEmailTemplate,
    deleteEmailTemplate,
    sendEmailCampaign,
    getEmailCampaigns,
    getCampaignStats
}; 