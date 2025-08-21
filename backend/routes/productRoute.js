import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, updateProductStock, updateProduct, getProductsByFilter } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1},{name:'image5',maxCount:1},{name:'image6',maxCount:1},{name:'image7',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.post('/update-stock',adminAuth,updateProductStock);
productRouter.post('/update',adminAuth,updateProduct);
productRouter.get('/list',listProducts)
productRouter.get('/filter',getProductsByFilter)

export default productRouter