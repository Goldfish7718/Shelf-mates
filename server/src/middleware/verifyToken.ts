import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  decode?: {
    fName: string;
    lName: string;
    username: string;
    isAdmin: boolean;
    _id: string;
    productsPurchased: [string];
  };
}

const verifyToken = async (req: ExtendedRequest, res: Response, next: any) => {
  try {
    console.log("COOKIE TOKEN: ", req.cookies.token);
    console.log("HEADER TOKEN: ", req.headers["x-auth-header"]);
    console.log("BODY TOKEN: ", req.body.token);
    
    const token = req.cookies.token || req.headers["x-auth-header"] || req.body.token

    if (req.cookies.token) {
        console.log("Token extracted from cookies");
    } else if (req.headers["x-auth-header"]) {
        console.log("Token extracted from header");
    } else if (req.body.token){
        console.log("Token extracted from body")
    } else {
        console.log("No token found");
    } 

    if (!token)
      return res.status(401).json({
        message: "User not authentiated",
        isAuthenticated: false,
      });

    const decode = jwt.verify(token, `${process.env.JWT_SECRET}`);

    req.decode = decode as ExtendedRequest["decode"];
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: err.message,
        isAuthenticated: false,
      });
    }
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      isAuthenticated: false,
    });
  }
};

export default verifyToken;
