import settingsModel from '../models/settingsModel.js';

// Get delivery fee
const getDeliveryFee = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new settingsModel({ deliveryFee: 50 });
            await settings.save();
        }
        
        res.json({ 
            success: true, 
            deliveryFee: settings.deliveryFee 
        });
    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update delivery fee (admin only)
const updateDeliveryFee = async (req, res) => {
    try {
        const { deliveryFee } = req.body;
        
        if (!deliveryFee || deliveryFee < 0) {
            return res.json({ 
                success: false, 
                message: "Invalid delivery fee amount" 
            });
        }
        
        let settings = await settingsModel.findOne();
        
        if (!settings) {
            settings = new settingsModel({ deliveryFee });
        } else {
            settings.deliveryFee = deliveryFee;
            settings.updatedAt = Date.now();
        }
        
        await settings.save();
        
        res.json({ 
            success: true, 
            message: "Delivery fee updated successfully",
            deliveryFee: settings.deliveryFee 
        });
    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { getDeliveryFee, updateDeliveryFee }; 