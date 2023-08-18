import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        default: [],
        ref: 'users'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users'
    }
}, {
    timestamps: true
})

export default mongoose.model('chatrooms', ChatRoomSchema, 'chatrooms')