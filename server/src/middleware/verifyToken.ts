import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

export interface ExtendedRequest extends Request {
    decode?: object | string; 
}

const verifyToken = async (req: ExtendedRequest, res: Response, next: any) => {
    try {
        const { token } = req.cookies
        
        if (!token)
            return res
                .status(401)
                .json({
                    message: "No Token",
                    isAuthenticated: false
                })

        const decode = jwt.verify(token, `${process.env.JWT_SECRET}`)
        
        req.decode = decode
        next()

    } catch (err) {
        return res
            .status(500)
            .json({
                message: "Internal Server Error",
                isAuthenticated: false
            })
    }
}

export default verifyToken