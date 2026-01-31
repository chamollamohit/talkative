import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/utils.js"
import cloudinary from "../lib/cloudinary.js"


export const signup = async (req, res) => {
    const { userName, fullName, email, password } = req.body
    try {
        if (!userName || !fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        
        const user = await User.findOne({ $or: [{ userName }, { email }] })

        if (user) {
            return res.status(400).json({ message: "User already exist with email or username" })
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            userName
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
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

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const user = await User.findOne({email})

        if (!user) {
            res.status(400).json({message:"Invalid Credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
    console.log("Error in login", error.meesage);
    res.status(500).json({message:"Internal Server Error"})        
    }
}

export const logout = async (req, res) => { 
    try {
        res.clearCookie('jwt')
        res.status(200).json({message: "Logged out Successfylly"})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const updateProfile = async (req, res) => { 
    try {
        const {profilePic} = req.body

        const userId = req.user._id

        if (!userId) {
            return res.status(400).json({message: "Profile Picture is required"})
        }
        const uploadProfilePic = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadProfilePic.secure_url}, {new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in Update Profile Controller:", error.message);
        res.status(500).json({message:"Internal error"})
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in Update Profile Controller:", error.message);
        res.status(500).json({message:"Internal error"})
    }
}