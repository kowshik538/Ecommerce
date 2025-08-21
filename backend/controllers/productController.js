import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, detailedDescription, price, category, subCategory, sizes, bestseller, sizeStock } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]
        const image6 = req.files.image6 && req.files.image6[0]
        const image7 = req.files.image7 && req.files.image7[0]

        const images = [image1, image2, image3, image4, image5, image6, image7].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        // Handle sizes parsing - could be JSON string or comma-separated string
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (e) {
            // If JSON parsing fails, treat as comma-separated string
            parsedSizes = sizes.split(',').map(size => size.trim());
        }

        const productData = {
            name,
            description,
            detailedDescription: detailedDescription || "",
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            sizeStock: sizeStock ? JSON.parse(sizeStock) : {},
            image: imagesUrl,
            date: Date.now()
        }
        console.log(productData);
        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for getting products by category and subcategory
const getProductsByFilter = async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (subCategory) {
            filter.subCategory = subCategory;
        }
        
        const products = await productModel.find(filter);
        res.json({success: true, products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product stock
const updateProductStock = async (req, res) => {
    try {
        
        const { productId, sizeStock } = req.body
        const product = await productModel.findByIdAndUpdate(
            productId, 
            { sizeStock: JSON.parse(sizeStock) },
            { new: true }
        )
        res.json({success:true, message: "Stock Updated", product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        
        const { productId, name, description, detailedDescription, price, category, subCategory, sizes, bestseller, sizeStock } = req.body

        // Handle sizes parsing - could be JSON string or comma-separated string
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (e) {
            // If JSON parsing fails, treat as comma-separated string
            parsedSizes = sizes.split(',').map(size => size.trim());
        }

        const updateData = {
            name,
            description,
            detailedDescription: detailedDescription || "",
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            sizeStock: sizeStock ? JSON.parse(sizeStock) : {}
        }

        const product = await productModel.findByIdAndUpdate(
            productId, 
            updateData,
            { new: true }
        )
        res.json({success:true, message: "Product Updated", product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProductStock, updateProduct, getProductsByFilter }









