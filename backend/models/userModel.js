import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
        country: { type: String, default: "India" }
    },
    preferences: {
        newsletter: { type: Boolean, default: true },
        notifications: { type: Boolean, default: true },
        theme: { type: String, default: "light" }
    },
    cartData: { type: Object, default: {} },
    resetOTP: { type: String },
    resetOTPExpiry: { type: Date }
},  { timestamps: true, minimize: false })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel