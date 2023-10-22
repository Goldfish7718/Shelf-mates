import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'

const app = express()

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)

const connectDB = async (url: string) => {
    await mongoose
        .connect(url)
        .then(() => console.log("Database Connected"))
        .catch(err => console.log(err))
}

app.listen(3000, () => {
    connectDB('mongodb://0.0.0.0:27017/Shelf-mates')
    console.log("Server started on port 3000");    
})

