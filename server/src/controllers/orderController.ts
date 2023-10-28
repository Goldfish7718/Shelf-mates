import { Request, Response } from 'express';
import Stripe from 'stripe';
import Cart from '../models/cartModel';
import Product from '../models/productModel';
const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: '2023-10-16'
});

export const cartCheckout = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const potentialCart = await Cart.findOne({ userId })

        
        if (!potentialCart)
        return res
            .status(403)
            .json({ message: "This User Does Not Exist" })
    
        const prices = await Promise.all(potentialCart?.cartItems.map(async item => {
            const product = await Product.findById(item.productId)
            return product?.price
        }))

        const session = await stripe.checkout.sessions.create({
            line_items: potentialCart.cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name
                        },
                        unit_amount: prices[index]! * 100
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment',
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/failed`,
        });

        const { url } = session
        
        res
            .status(200)
            .json({ url })
    } catch (err) {
        res.send(err)
    }
}