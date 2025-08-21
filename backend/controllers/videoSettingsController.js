import videoSettingsModel from '../models/videoSettingsModel.js';

// Get current video settings
const getVideoSettings = async (req, res) => {
    try {
        let settings = await videoSettingsModel.findOne();
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new videoSettingsModel({
                videoUrl: "https://www.youtube.com/embed/7m16dFI1AF8?si=BArkMckzpumxU50k",
                title: "Our Story in 60 Seconds",
                description: "Discover the passion, purpose, and people behind our brand. We believe in making fashion sustainable, inclusive, and stylish for all.",
                isActive: true
            });
            await settings.save();
        }

        res.json({
            success: true,
            settings
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update video settings
const updateVideoSettings = async (req, res) => {
    try {
        const { videoUrl, title, description, isActive } = req.body;

        // Validate video URL (basic YouTube embed URL validation)
        if (videoUrl && !videoUrl.includes('youtube.com/embed/')) {
            return res.json({
                success: false,
                message: "Please provide a valid YouTube embed URL (should contain 'youtube.com/embed/')"
            });
        }

        let settings = await videoSettingsModel.findOne();
        
        if (!settings) {
            settings = new videoSettingsModel();
        }

        // Update fields if provided
        if (videoUrl !== undefined) settings.videoUrl = videoUrl;
        if (title !== undefined) settings.title = title;
        if (description !== undefined) settings.description = description;
        if (isActive !== undefined) settings.isActive = isActive;
        
        settings.updatedAt = Date.now();
        await settings.save();

        res.json({
            success: true,
            message: "Video settings updated successfully",
            settings
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to convert regular YouTube URL to embed URL
const convertToEmbedUrl = (url) => {
    if (!url) return url;
    
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    // Convert regular YouTube URL to embed URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (videoIdMatch) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    
    return url;
};

export { getVideoSettings, updateVideoSettings, convertToEmbedUrl }; 