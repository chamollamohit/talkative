import cloudinary from "../lib/cloudinary.js"
import {  getSocketIdFromUserId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"


export const getUser = async (req, res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUser = await User.find({_id: {$ne: loggedInUser}}).select('-password')
        res.status(200).json(filteredUser)
    } catch (error) {
        console.log("Error in get User:", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getChat = async (req, res) => {
    try {
        const {id: reciverUserId} = req.params
        const loggedInUserId = req.user._id
        const chats = await Message.find({$or:[{senderId: loggedInUserId,  reciverId: reciverUserId}, 
            {senderId: reciverUserId,  reciverId: loggedInUserId}]})

            res.status(200).json(chats)
    } catch (error) {
        console.log("Error in get Chats:", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {id: reciverUserId} = req.params
        const loggedInUserId = req.user._id
        const {text, image} = req.body

        let imageUrl 
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image)
            imageUrl = uploadImage.secure_url 
        }

        const newMessage = await Message.create({senderId: loggedInUserId, reciverId:reciverUserId, senderMessage: text, image: imageUrl })
        
        const recieverSocketId = getSocketIdFromUserId(reciverUserId)
        if (recieverSocketId) {
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }
        res.status(200).json(newMessage)

    } catch (error) {
        console.log("Error in Sending Message:", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}