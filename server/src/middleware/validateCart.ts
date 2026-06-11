import { Response } from "express";
import mongoose, { Document } from "mongoose";
import Product, { ProductDocument } from "../models/productModel";
import Cart, { CartDocument } from "../models/cartModel";
import { ExtendedRequest } from "./verifyToken";

export interface CartExtendedRequest extends ExtendedRequest {
  product?: ProductDocument & Document;
  cart?: CartDocument & Document;
}

const validateCart = async (
  req: CartExtendedRequest,
  res: Response,
  next: Function,
) => {
  if (!req.decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productId } = req.params;
  const { _id: userId } = req.decode;
  const operation = req.body.operation || "increment";

  console.log("Validate Cart", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(403).json({ message: "Invalid User ID format" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid Product ID format" });
  }

  try {
    const potentialProduct = await Product.findById(productId);
    const potentialCart = await Cart.findOne({ userId });

    if (!potentialCart)
      return res.status(403).json({ message: "This User Does Not Exist" });

    if (!potentialProduct)
      return res.status(404).json({ message: "This Product Does not exist" });

    if (operation == "increment" && potentialProduct.stock < 1)
      return res.status(400).json({ message: "This item is out of stock." });

    req.product = potentialProduct;
    req.cart = potentialCart;

    next();
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default validateCart;
