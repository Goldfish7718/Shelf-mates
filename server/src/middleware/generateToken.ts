import jwt from 'jsonwebtoken'

const generateToken = (payload: Object) => {
    const token = jwt.sign(payload, `${process.env.JWT_SECRET}`)
    return token
}

export default generateToken