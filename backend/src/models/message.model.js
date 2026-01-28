import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderMessage: {
        type: string
    },
    image: {
        type: string
    }
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema)
export default Message