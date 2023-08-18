import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    chatrooms: {
        type: Array,
        default: [],
        ref: 'chatrooms'
    }
}, {
    timestamps: true
})

export default mongoose.model('users', UserSchema, 'users')