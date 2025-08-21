import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import settingsModel from "../models/settingsModel.js";
import { addToWalletFromCancellation, useWalletBalance } from "./walletController.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'inr' // Changed to Indian Rupees
let deliveryCharge = 50 // Default delivery charge

// Function to get delivery charge from settings
const getDeliveryCharge = async () => {
    try {
        const settings = await settingsModel.findOne();
        return settings ? settings.deliveryFee : 50;
    } catch (error) {
        console.log('Error fetching delivery charge:', error);
        return 50; // Default fallback
    }
};

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Helper function to reduce stock
const reduceStock = async (items) => {
    for (const item of items) {
        try {
            const product = await productModel.findById(item._id || item.id);
            if (!product) {
                console.log(`Product not found: ${item._id || item.id}`);
                continue;
            }
            
            if (!product.sizeStock || !product.sizeStock[item.size]) {
                console.log(`Size ${item.size} not found in stock for product ${item._id || item.id}`);
                continue;
            }
            
            const currentStock = product.sizeStock[item.size];
            const newStock = Math.max(0, currentStock - item.quantity);
            
            await productModel.findByIdAndUpdate(item._id || item.id, {
                $set: { [`sizeStock.${item.size}`]: newStock }
            });
            
            console.log(`Reduced stock for product ${item._id || item.id}, size ${item.size} by ${item.quantity}. New stock: ${newStock}`);
        } catch (error) {
            console.error(`Error reducing stock for product ${item._id || item.id}, size ${item.size}:`, error);
        }
    }
};

// Helper function to restore stock
const restoreStock = async (items) => {
    for (const item of items) {
        try {
            const product = await productModel.findById(item._id || item.id);
            if (!product) {
                console.log(`Product not found for stock restoration: ${item._id || item.id}`);
                continue;
            }
            
            if (!product.sizeStock || product.sizeStock[item.size] === undefined) {
                console.log(`Size ${item.size} not found in stock for product ${item._id || item.id}`);
                continue;
            }
            
            const currentStock = product.sizeStock[item.size];
            const newStock = currentStock + item.quantity;
            
            await productModel.findByIdAndUpdate(item._id || item.id, {
                $set: { [`sizeStock.${item.size}`]: newStock }
            });
            
            console.log(`Restored stock for product ${item._id || item.id}, size ${item.size} by ${item.quantity}. New stock: ${newStock}`);
        } catch (error) {
            console.error(`Error restoring stock for product ${item._id || item.id}, size ${item.size}:`, error);
        }
    }
};

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const userId = req.userId; // Get from authenticated user
        const { items, amount, address} = req.body;

        console.log('Order placement - Items received:', JSON.stringify(items, null, 2));

        // Get current delivery charge
        const currentDeliveryCharge = await getDeliveryCharge();

        // Reduce stock for all items
        await reduceStock(items);

        const orderData = {
            userId,
            items,
            address,
            amount: amount + currentDeliveryCharge, // Add delivery charge to total
            deliveryCharge: currentDeliveryCharge,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const userId = req.userId; // Get from authenticated user
        const { items, amount, address} = req.body
        const { origin } = req.headers;

        // Get current delivery charge
        const currentDeliveryCharge = await getDeliveryCharge();

        // Reduce stock for all items
        await reduceStock(items);

        const orderData = {
            userId,
            items,
            address,
            amount: amount + currentDeliveryCharge, // Add delivery charge to total
            deliveryCharge: currentDeliveryCharge,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: currentDeliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            // Restore stock if payment failed
            const order = await orderModel.findById(orderId);
            if (order) {
                await restoreStock(order.items);
            }
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const userId = req.userId; // Get from authenticated user
        const { items, amount, address} = req.body

        // Get current delivery charge
        const currentDeliveryCharge = await getDeliveryCharge();

        // Reduce stock for all items
        await reduceStock(items);

        const orderData = {
            userId,
            items,
            address,
            amount: amount + currentDeliveryCharge, // Add delivery charge to total
            deliveryCharge: currentDeliveryCharge,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: (amount + currentDeliveryCharge) * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const userId = req.userId; // Get from authenticated user
        const { razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({ success: true, message: "Payment Successful" })
        } else {
            // Restore stock if payment failed
            const order = await orderModel.findById(orderInfo.receipt);
            if (order) {
                await restoreStock(order.items);
            }
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const userId = req.userId; // Get from authenticated user

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId; // Get from authenticated user
    const { orderId, cancelReason } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Ensure user owns the order
    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Check if already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order already cancelled" });
    }

    const now = Date.now();
    const timeDiffInMs = now - order.date;
    const hoursPassed = timeDiffInMs / (1000 * 60 * 60);

    if (hoursPassed > 48) {
      return res.status(400).json({ success: false, message: "Cannot cancel after 48 hours" });
    }

    // Restore stock when order is cancelled
    await restoreStock(order.items);

    // Add money to wallet if payment was made online
    if (order.payment && (order.paymentMethod === "Stripe" || order.paymentMethod === "Razorpay")) {
      const walletResult = await addToWalletFromCancellation(userId, order.amount, orderId);
      if (walletResult.success) {
        console.log(`Added ₹${order.amount} to wallet for user ${userId}`);
      } else {
        console.error('Failed to add money to wallet:', walletResult.error);
      }
    }

    order.status = "Cancelled";
    order.cancelReason = cancelReason || "User Cancelled";
    await order.save();

    const message = order.payment && (order.paymentMethod === "Stripe" || order.paymentMethod === "Razorpay") 
      ? "Order cancelled successfully. Amount has been added to your wallet."
      : "Order cancelled successfully";

    res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using wallet balance
const placeOrderWithWallet = async (req, res) => {
  try {
    const userId = req.userId; // Get from authenticated user
    const { items, amount, address, walletAmount } = req.body;

    console.log('Wallet order placement - Items received:', JSON.stringify(items, null, 2));

    // Get current delivery charge
    const currentDeliveryCharge = await getDeliveryCharge();
    const totalAmount = amount + currentDeliveryCharge;

    // Check if wallet has sufficient balance
    const walletResult = await useWalletBalance(userId, walletAmount);
    if (!walletResult.success) {
      return res.json({ success: false, message: walletResult.message });
    }

    // Reduce stock for all items
    await reduceStock(items);

    const orderData = {
      userId,
      items,
      address,
      amount: totalAmount,
      deliveryCharge: currentDeliveryCharge,
      paymentMethod: "Wallet",
      payment: true,
      walletAmount: walletAmount,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ 
      success: true, 
      message: "Order placed successfully using wallet balance",
      remainingBalance: walletResult.newBalance
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, cancelOrder, placeOrderWithWallet}