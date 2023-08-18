import mongoose from "mongoose";

const ChatItemSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'chatrooms'
    },
    message: {
        type: String,
        default: ''
    },
    isFile: {
        type: Boolean,
        default: false
    },
    fileLocation: {
        type: String,
        default: ''
    },
    from: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    to: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'users'
    },
    readStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model('chatitems', ChatItemSchema, 'chatitems')