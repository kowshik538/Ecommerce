import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    address: { type: Object, required: true },
    status: { type: String, required: true, default:'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true , default: false },
    walletAmount: { type: Number, default: 0 }, // Amount paid from wallet
    date: {type: Number, required:true},
    cancelReason: { type: String, default: '' },

})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;