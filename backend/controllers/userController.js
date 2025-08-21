import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password, preferences } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            preferences: {
                newsletter: preferences?.newsletter ?? true,
                notifications: preferences?.notifications ?? true,
                theme: 'light'
            }
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await userModel.findById(userId).select('-password -resetOTP -resetOTPExpiry');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, preferences } = req.body;

        const updateData = {};
        
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (preferences) updateData.preferences = preferences;

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -resetOTP -resetOTPExpiry');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully", user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.userId;
        
        console.log('Upload request received:', { userId, hasFile: !!req.file });
        
        if (!req.file) {
            return res.json({ success: false, message: "Please upload a profile photo" });
        }

        const profilePhoto = req.file;
        console.log('File details:', { 
            originalname: profilePhoto.originalname, 
            path: profilePhoto.path, 
            size: profilePhoto.size 
        });

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(profilePhoto.path, {
            folder: 'profile-photos',
            width: 400,
            height: 400,
            crop: 'fill',
            quality: 'auto'
        });
        console.log('Cloudinary upload successful:', result.secure_url);

        // Update user profile with new photo URL
        const user = await userModel.findByIdAndUpdate(
            userId,
            { profilePhoto: result.secure_url },
            { new: true }
        ).select('-password -resetOTP -resetOTPExpiry');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        console.log('User profile updated successfully');

        res.json({ 
            success: true, 
            message: "Profile photo updated successfully", 
            profilePhoto: result.secure_url,
            user 
        });

    } catch (error) {
        console.error('Error in uploadProfilePhoto:', error);
        res.json({ success: false, message: error.message });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Please provide current and new password" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters long" });
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        if (!password) {
            return res.json({ success: false, message: "Please provide your password to confirm account deletion" });
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Password is incorrect" });
        }

        // Delete user account
        await userModel.findByIdAndDelete(userId);

        res.json({ success: true, message: "Account deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    loginUser, 
    registerUser, 
    adminLogin, 
    getUserProfile, 
    updateUserProfile, 
    uploadProfilePhoto, 
    changePassword, 
    deleteAccount 
}