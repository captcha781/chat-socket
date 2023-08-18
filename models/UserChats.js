import mongoose from "mongoose";

const UserChats = new mongoose.Schema({
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
}, {
    timestamps: true
})

export default mongoose.model('userchatrooms', UserChats, 'userchatrooms')