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
        type: String
    },
    image: {
        type: String
    }
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema)
export default Message