import { Request, Response } from "express";
import { ExtendedRequest } from "../middleware/validateCart";
import Cart from "../models/cartModel";
import { isValidObjectId } from "mongoose";

export const getCart = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        
        if (!isValidObjectId(userId))
            return res
                .status(400)
                .json({ message: 'Unavailabe ID' })

        const potentialCart = await Cart.findOne({ userId })
        
        if (!potentialCart)
            return res
                .status(400)
                .json({ message: 'This Cart does not exist' })

        const { cartItems } = potentialCart

        const transformedCart = cartItems.map(item => {
            const plainItem = (item as any).toObject();
            const imageBase64 = plainItem.image.data.toString('base64');
            return {
                ...plainItem,
                image: `data:${plainItem.image.contentType};base64,${imageBase64}`
            };
        });
        
        res
            .status(200)
            .json({ transformedCart })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const addToCart = async (req: ExtendedRequest, res: Response) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }

        const { _id, price, name, image } = req.product        

        const productExists = req.cart.cartItems.find(product => product.productId.toString() == _id.toString())        

        if (!productExists)
            req.cart.cartItems.push({
                productId: _id,
                quantity: 1,
                price,
                name,
                image
            })

        else {
            productExists.quantity += 1
            productExists.price = price * productExists.quantity
        }

        await req.cart.save()

        res
            .status(200)
            .json({ message: "Added Item to Cart" })

    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const decrementQuantity = async (req: ExtendedRequest, res: Response) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }

        const { _id, price } = req.product
        const productExists = req.cart.cartItems.find(product => product.productId.toString() == _id.toString())

        if (!productExists)
            return res
                .status(400)
                .json({ message: "This Product Does not Exist" })

        else if (productExists.quantity == 1)
            await Cart.updateOne(
                { _id: req.cart._id },
                { $pull: { cartItems: { productId: _id } } }
            );    

        else
            productExists.quantity -= 1
            productExists.price = price * productExists.quantity
                

        await req.cart.save()

        res
            .status(200)
            .json({ message: "Product Decremented" })
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const deleteProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        if (!req.product || !req.cart) {
            return res
                .status(400)
                .json({ message: "Product or Cart not found in request" });
        }

        const { _id } = req.product

        await Cart.findOneAndUpdate({
            _id: req.cart._id
        },
        {
            $pull: {
                cartItems: {
                    productId: _id
                }
            }
        })

        res
            .status(200)
            .json({ message: "Deleted Product from cart" })

    } catch (err) {
        res
        .status(500)
        .json({ message: "Internal Server Error" })
    }
}

