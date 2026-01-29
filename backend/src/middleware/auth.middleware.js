import jwt from "jsonwebtoken";
import User  from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorize Access" });
        }

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decodeToken) {
            return res.status(401).json({ message: "Unauthorize - Invalid Token" });
        }

        const user = await User.findById(decodeToken.userId).select('-password')

        if (!user) {
            return res.status(401).json({ message: "Unauthorize - User not Found" });
        }

        req.user = user

        next()

    } catch (error) {
        console.log("Error in middleware:", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};
