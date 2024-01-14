"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.getSalesData = exports.getReviewCount = exports.getMostSoldData = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getMostSoldData = async (req, res) => {
    var _a, _b;
    try {
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        const orders = await orderModel_1.default.find({
            createdAt: {
                $gte: todayStart,
                $lt: todayEnd,
            }
        });
        let transformedData = [];
        let priceComparison;
        if (orders.length > 0) {
            const soldProducts = [];
            orders.map((order) => {
                order.items.map((item) => {
                    soldProducts.push({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.totalPrice / item.quantity
                    });
                });
            });
            const mostSold = {};
            soldProducts.forEach((product) => {
                const productId = product.productId;
                if (!mostSold[productId]) {
                    mostSold[productId] = {
                        productId: productId,
                        quantity: product.quantity,
                        price: product.price
                    };
                }
                else {
                    mostSold[productId].quantity += product.quantity;
                }
            });
            const mostSoldArray = Object.values(mostSold);
            transformedData = await Promise.all(mostSoldArray.map(async (product) => {
                const originalProduct = await productModel_1.default.findById(product.productId);
                return {
                    ...product,
                    name: originalProduct === null || originalProduct === void 0 ? void 0 : originalProduct.name,
                    stock: originalProduct === null || originalProduct === void 0 ? void 0 : originalProduct.stock
                };
            }));
            for (let i = 0; i < transformedData.length; i++) {
                for (let j = 0; j < transformedData.length; j++) {
                    if (((_a = transformedData[j]) === null || _a === void 0 ? void 0 : _a.quantity) < ((_b = transformedData[i]) === null || _b === void 0 ? void 0 : _b.quantity)) {
                        const temp = transformedData[j];
                        transformedData[j] = transformedData[i];
                        transformedData[i] = temp;
                    }
                }
            }
            transformedData = transformedData.splice(0, 4);
            priceComparison = {
                product1: {
                    name: transformedData[0].name,
                    totalSale: transformedData[0].price * transformedData[0].quantity
                },
                product2: {
                    name: transformedData[1].name,
                    totalSale: transformedData[1].price * transformedData[1].quantity
                }
            };
            if (priceComparison.product1.totalSale < priceComparison.product2.totalSale) {
                const temp = priceComparison.product1;
                priceComparison.product1 = priceComparison.product2;
                priceComparison.product2 = temp;
            }
        }
        const products = await productModel_1.default.find({});
        const transformedProducts = products.map(product => {
            return {
                name: product.name,
                productId: product._id,
                category: product.category
            };
        });
        res.status(200).json({ transformedData, transformedProducts, priceComparison });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.getMostSoldData = getMostSoldData;
const getReviewCount = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel_1.default.findById(productId);
        if ((product === null || product === void 0 ? void 0 : product.reviews.length) === 0) {
            res
                .status(200)
                .json({ message: 'No Reviews For this product' });
        }
        // @ts-ignore
        const reviews = await Promise.all(product === null || product === void 0 ? void 0 : product.reviews.map(async (reviewId) => {
            const review = await reviewModel_1.default.findById(reviewId);
            return review;
        }));
        const frequencyMap = [
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
        ];
        reviews.map((review) => {
            const item = frequencyMap.find((item) => item.stars === review.stars);
            if (item)
                item.count++;
        });
        const { name } = product;
        res
            .status(200)
            .json({ frequencyMap, name });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: 'Internal Server Error' });
    }
};
exports.getReviewCount = getReviewCount;
const getSalesData = async (req, res) => {
    try {
        const { productId } = req.params;
        const orders = await orderModel_1.default.find({ 'items.productId': productId });
        let salesData = orders.flatMap(order => {
            return order.items
                .filter(item => { var _a; return ((_a = item.productId) === null || _a === void 0 ? void 0 : _a.toString()) === productId; })
                .map(item => ({
                // @ts-ignore
                ...item.toObject(),
                // @ts-ignore
                date: order.createdAt.toLocaleDateString()
            }));
        });
        salesData = salesData.reduce((result, item) => {
            const existingItem = result.find((i) => i.date === item.date);
            if (existingItem) {
                existingItem.totalPrice += item.totalPrice;
            }
            else {
                result.push(item);
            }
            return result;
        }, []);
        const totalSales = salesData.reduce((acc, current) => {
            return acc + current.totalPrice;
        }, 0);
        const totalQuantity = salesData.reduce((acc, current) => {
            return acc + current.quantity;
        }, 0);
        res
            .status(200)
            .json({ salesData, totalSales, totalQuantity });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getSalesData = getSalesData;
const getOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.default.find({});
        const transformedOrders = await Promise.all(orders.map(async (order) => {
            const user = await userModel_1.default.findById(order.userId);
            return {
                ...order.toObject(),
                fName: user === null || user === void 0 ? void 0 : user.fName,
                lName: user === null || user === void 0 ? void 0 : user.lName,
                username: user === null || user === void 0 ? void 0 : user.username,
                // @ts-ignore
                date: order.createdAt.toLocaleDateString()
            };
        }));
        res
            .status(200)
            .json({ transformedOrders });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getOrders = getOrders;
