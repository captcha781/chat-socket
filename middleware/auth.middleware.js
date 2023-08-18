import jwt from 'jsonwebtoken'
import config from '../config/config.cjs'
import User from '../models/User.js'

export const authMiddleware = async (req, res, next) => {
    try {
        
        let token = req.headers['authorization']
        if(!token){
            return res.status(400).json({ success: false, message: 'Not authenicated' })
        }
        jwt.verify(token, config.JWT_SECRET)
        let decode = jwt.decode(token)
        req.user = await User.findById(decode?.user)

        return next()

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'Not authenicated' })
    }
}