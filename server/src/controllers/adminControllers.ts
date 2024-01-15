import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import Review from "../models/reviewModel";
import User from "../models/userModel";
import Address from "../models/addressModel";

export const getMostSoldData = async (req: Request, res: Response) => {
    try {
        const todayStart = new Date().setHours(0, 0, 0, 0)        
        const todayEnd = new Date().setHours(23, 59, 59, 999)

        const orders = await Order.find({
            createdAt: {
                $gte: todayStart,
                $lt: todayEnd,
            }
        })

        let transformedData = []
        let priceComparison
        
        if (orders.length > 0) {

            const soldProducts: any = []
            orders.map((order: any) => {
                order.items.map((item: any) => {
                    soldProducts.push({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.totalPrice / item.quantity 
                    })
                })
            })

            const mostSold: any = {};

            soldProducts.forEach((product: any) => {
                const productId = product.productId;

                if (!mostSold[productId]) {
                    mostSold[productId] = {
                        productId: productId,
                        quantity: product.quantity,
                        price: product.price
                    };
                } else {
                    mostSold[productId].quantity += product.quantity;
                }
            });

            const mostSoldArray = Object.values(mostSold);

            transformedData = await Promise.all(mostSoldArray.map(async (product: any) => {
                const originalProduct = await Product.findById(product.productId)

                return {
                    ...product,
                    name: originalProduct?.name,
                    stock: originalProduct?.stock
                }
            }))

            for (let i = 0; i < transformedData.length; i++) {
                for (let j = 0; j < transformedData.length; j++) {
                    if (transformedData[j]?.quantity < transformedData[i]?.quantity) {
                        const temp = transformedData[j]
                        transformedData[j] = transformedData[i]
                        transformedData[i] = temp
                    }
                } 
            }

            transformedData = transformedData.splice(0, 4)

            priceComparison = {
                product1: {
                    name: transformedData[0].name,
                    totalSale: transformedData[0].price * transformedData[0].quantity
                },
                product2: {
                    name: transformedData[1].name,
                    totalSale: transformedData[1].price * transformedData[1].quantity
                }
            }

            if (priceComparison.product1.totalSale < priceComparison.product2.totalSale) {
                const temp = priceComparison.product1
                priceComparison.product1 = priceComparison.product2
                priceComparison.product2 = temp
            }

        }

        const products = await Product.find({})

        const transformedProducts = products.map(product => {
            return {
                name: product.name,
                productId: product._id,
                category: product.category
            }
        })

        res.status(200).json({ transformedData, transformedProducts, priceComparison })
    } catch (err) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' })
    }
}


export const getReviewCount = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params

        const product = await Product.findById(productId)

        if (product?.reviews.length === 0) {
            res
                .status(200)
                .json({ message: 'No Reviews For this product' })
        }

        // @ts-ignore
        const reviews = await Promise.all(product?.reviews.map(async (reviewId: string) => {
            const review = await Review.findById(reviewId)

            return review
        }))

        const frequencyMap: any = [
            {
                stars: 5,
                count: 0
            },
            {
                stars: 4,
                count: 0
            },
            {
                stars: 3,
                count: 0
            },
            {
                stars: 2,
                count: 0
            },
            {
                stars: 1,
                count: 0
            },
        ]

        reviews.map((review: any) => {
            const item = frequencyMap.find((item: any) => item.stars === review.stars)

            if (item) item.count++
        })

        const { name } = product!

        res
            .status(200)
            .json({ frequencyMap, name })
    } catch (err) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' })
    }
}

export const getSalesData = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params
        
        const orders = await Order.find(
            { 'items.productId': productId }
        )

        let salesData = orders.flatMap(order => {
            return order.items
                .filter(item => item.productId?.toString() === productId)
                .map(item => ({
                    // @ts-ignore
                    ...item.toObject(),
                    // @ts-ignore
                    date: order.createdAt.toLocaleDateString()
                }));
        });

        salesData = salesData.reduce((result, item) => {
            const existingItem = result.find((i: any) => i.date === item.date);
        
            if (existingItem) {
                existingItem.totalPrice += item.totalPrice;
            } else {
                result.push(item);
            }
        
            return result;
        }, []);

        const totalSales = salesData.reduce((acc, current) => {
            return acc + current.totalPrice
        }, 0)

        const totalQuantity = salesData.reduce((acc, current) => {
            return acc + current.quantity
        }, 0)

        res
            .status(200)
            .json({ salesData, totalSales, totalQuantity })
        
    } catch (err) {
        console.log(err);
    }
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: 'desc' })

        const transformedOrders = await Promise.all(orders.map(async order => {
            const user = await User.findById(order.userId)
            const address = await Address.findById(order.addressId)

            return {
                ...order.toObject(),
                address: address?.toObject(),
                fName: user?.fName,
                lName: user?.lName,
                username: user?.username,
                // @ts-ignore
                date: order.createdAt.toLocaleDateString()
            }
        }))

        res
            .status(200)
            .json({ transformedOrders })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Internal server error'  })
    }
}

export const getOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
        const address = await Address.findById(order?.addressId)
        const user = await User.findById(order?.userId)

        if (!order || !address || !user) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderItems = await Promise.all(order?.items.map(async item => {
            const product = await Product.findById(item.productId)

            return {
                // @ts-ignore
                ...item.toObject(),
                name: product?.name
            }
        }))

        const orderObject = {
            ...order?.toObject(),
            items: orderItems,
            address,
            fName: user?.fName,
            lName: user?.lName,
            username: user?.username,
            // @ts-ignore
            date: order.createdAt.toLocaleDateString()
        }

        res
            .status(200)
            .json({ orderObject })
    } catch (err) {
        console.log(err);
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, { 'productsPurchased': 0, 'password': 0 })        

        res
            .status(200)
            .json({ users })
    } catch (err) {
        console.log(err);
    }
}