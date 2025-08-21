import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// add to cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, size } = req.body

        // Check product stock
        const product = await productModel.findById(itemId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Check if size is available and in stock
        if (!product.sizes.includes(size)) {
            return res.json({ success: false, message: "Size not available" })
        }

        const stockCount = product.sizeStock && product.sizeStock[size] ? product.sizeStock[size] : 0
        if (stockCount <= 0) {
            return res.json({ success: false, message: "Size is out of stock" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {};

        // Check if adding this item would exceed stock
        const currentCartQuantity = cartData[itemId] && cartData[itemId][size] ? cartData[itemId][size] : 0
        if (currentCartQuantity >= stockCount) {
            return res.json({ success: false, message: "Cannot add more items. Stock limit reached" })
        }

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, size, quantity } = req.body

        // Check product stock
        const product = await productModel.findById(itemId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        const stockCount = product.sizeStock && product.sizeStock[size] ? product.sizeStock[size] : 0
        if (quantity > stockCount) {
            return res.json({ success: false, message: "Quantity exceeds available stock" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// get user cart data
const getUserCart = async (req,res) => {
    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {};

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart }