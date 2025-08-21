import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import heroRoute from './routes/heroRoute.js';
import settingsRouter from './routes/settingsRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import videoSettingsRouter from './routes/videoSettingsRoute.js';
import emailRouter from './routes/emailRoute.js';
import walletRouter from './routes/walletRoute.js';
import path from 'path';
// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use("/api/hero", heroRoute);
app.use('/api/settings', settingsRouter);
app.use('/api/review', reviewRouter);
app.use('/api/video', videoSettingsRouter);
app.use('/api/email', emailRouter);
app.use('/api/wallet', walletRouter);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))