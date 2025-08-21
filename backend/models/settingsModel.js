import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    deliveryFee: {
        type: Number,
        default: 50,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const settingsModel = mongoose.model('Settings', settingsSchema);

export default settingsModel; 