import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/utils.js"


export const signup = async (req, res) => {

    const { username, fullname, email, password } = req.body
    try {

        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be more then 6 characters long" })
        }

        const user = await User.findOne({ $or: [{ username }, { email }] })

        if (user) {
            return res.status(400).json({ message: "User already exist with email or username" })
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            username
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                message: "User Registerd Successfully"
            })

        } else {
            res.status(400).json({
                message: "Invalid user Data"
            })
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const login = async (req, res) => { res.status(400) }

export const logout = async () => { }

export const updateProfile = async () => { }