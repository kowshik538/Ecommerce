import mongoose from 'mongoose';

const videoSettingsSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true,
        default: "https://www.youtube.com/embed/7m16dFI1AF8?si=BArkMckzpumxU50k"
    },
    title: {
        type: String,
        required: true,
        default: "Our Story in 60 Seconds"
    },
    description: {
        type: String,
        required: true,
        default: "Discover the passion, purpose, and people behind our brand. We believe in making fashion sustainable, inclusive, and stylish for all."
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const videoSettingsModel = mongoose.model('VideoSettings', videoSettingsSchema);

export default videoSettingsModel; 