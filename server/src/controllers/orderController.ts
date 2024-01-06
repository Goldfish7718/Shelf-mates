import { Request, Response } from 'express';
import Stripe from 'stripe';
import Cart from '../models/cartModel';
import Product from '../models/productModel';
import Order from '../models/orderModel';
import Address from '../models/addressModel';
import User from '../models/userModel';
import generateToken from '../middleware/generateToken';
import { ExtendedRequest } from '../middleware/verifyToken';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: '2023-10-16'
});

export const cartCheckout = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { paymentMethod, address } = req.body

        const potentialCart = await Cart.findOne({ userId });

        if (!potentialCart) {
            return res.status(403).json({ message: "This User Does Not Exist" });
        }

        const prices = await Promise.all(potentialCart?.cartItems.map(async item => {
            const product = await Product.findById(item.productId);
            return product?.price;
        }));

        const order = {
            items: potentialCart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                totalPrice: item.price
            })),
            userId,
            addressId: address,
            paymentMethod,
            subtotal: potentialCart.subtotal,
            confirmed: false
        };

        const orderDetails = JSON.stringify(order);
        const encodedOrderDetails = encodeURIComponent(orderDetails);

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
                };
            }),
            mode: 'payment',
            success_url: `http://localhost:5173/confirmation?orderId=${encodedOrderDetails}`,
            cancel_url: `http://localhost:5173/failed`,
        });

        const { url } = session;
        res.status(200).json({ url });
    } catch (err) {
        res.send(err);
    }
};

export const confirmOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        const { encode } = req.params

        const decodedOrderDetails = decodeURIComponent(encode as string);
        const orderObject = JSON.parse(decodedOrderDetails);
        
        let orderToEncode
        let encodedOrderDetails

        if (orderObject.confirmed != true) {
            orderObject.confirmed = true
            const order = await Order.create(orderObject)
            orderToEncode = order
                
            await Cart.findOneAndUpdate({ userId: order.userId }, {
                $set: {
                    cartItems: [],
                    subtotal: 0
                }
            });
            
            order.items.map(async (item: any) => {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: {
                        stock: -item.quantity!
                    }
                })
            })

            const potentialUser = await User.findById(orderObject.userId)

            await Promise.all(order.items.map(async (item: any) => {
                if (!potentialUser?.productsPurchased.includes(item.productId)) {
                    potentialUser?.productsPurchased.push(item.productId)
                }

                await potentialUser?.save()
            }))
        }

        const potentialUser = await User.findById(orderObject.userId)

        const productsPurchasedNew = potentialUser?.productsPurchased

        orderObject.items = await Promise.all(orderObject.items.map(async (item: any) => {
            const product = await Product.findById(item.productId)
            const productObj = product!.toObject();

            const imageBase64 = productObj.image.data.toString('base64');
            const { quantity } = item

            return {
                ...productObj,
                image: `data:${productObj.image.contentType};base64,${imageBase64}`,
                quantity
            };
        }))

        const address = await Address.findById(orderObject.addressId)
        orderObject.address = address

        if (orderToEncode) {
            const orderDetails = JSON.stringify(orderToEncode);
            encodedOrderDetails = encodeURIComponent(orderDetails);
        } else {
            encodedOrderDetails = null
        }

        res
            .status(200)
            .json({ orderObject, encodedOrderDetails, productsPurchasedNew })

    } catch (err) {
        console.log(err);
    }
}

