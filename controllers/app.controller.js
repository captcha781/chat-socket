import config from '../config/config.cjs'
import ChatRoom from '../models/ChatRoom.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import UserChats from '../models/UserChats.js'
import ChatItem from '../models/ChatItem.js'
import { emitToRoom } from '../config/socketConnect.js'

export const testApi = (req, res) => {
    try {
        return res.json({ success: true, message: 'API works fine' })
    } catch (error) {
        console.log('testApi',error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createUser = async (req, res) => {
    try {
        
        const { name, email, password } = req.body
        let userExists = await User.findOne({ email })

        if(userExists){
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        const newuser = new User({ name, password, email })
        await newuser.save()

        return res.json({ success: true, message: 'User added successfully' })

    } catch (error) {
        console.log('createUser',error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const signin = async (req, res) => {
    try {
        
        const { email, password } = req.body
        const userProfile = await User.findOne({ email })

        if (userProfile.password !== password){
            return res.status(400).json({ success: false, message: 'Incorrect password' })
        }

        userProfile.password = ''
        let token = jwt.sign({ user: userProfile._id.toString() }, config.JWT_SECRET)

        return res.json({ success: true, user: userProfile, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createRoom = async (req, res) => {
    try {
        
        const { roomName } = req.body

        const roomData = {
            roomName,
            roomId: uuidv4(),
            participants: [req.user.id],
            createdBy: req.user.id
        }

        let room = new ChatRoom(roomData) 
        req.user.chatrooms.push(room._id)

        await req.user.save()
        await room.save()

        return res.json({ success: true, message: 'Room created successfully', room })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const userList = async (req, res) => {
    try {
        
        let users = await User.find({}, { password: 0 })

        return res.json({ success: true, users })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const userInfo = async (req, res) => {
    try {
        req.user.password = ''
        return res.json({ success: true, user: req.user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const sendMessage = async (req, res) => {
    try {
        
        let { from, to, message, type } = req.body

        if(type === 'group'){

            let chatroom = await ChatRoom.findById(to)
            let chatItemData = {
                roomId: chatroom._id,
                message,
                from,
                to
            }
            let chat= new ChatItem(chatItemData)
            await chat.save()
            emitToRoom(chatroom.roomId,chat)

            return res.json({ success: true, message: 'Message sent successfully' })

        }

        let u2uChatRoom = await UserChats.findOne({ $or:[ { roomName: from+to }, { roomName: to+from } ] })
        if(!u2uChatRoom){
            let chatRoom = {
                roomId: uuidv4(),
                roomName: from+to,
                participants: [from, to]
            }
            u2uChatRoom = new UserChats(chatRoom)
            await u2uChatRoom.save()
        }

        let chatItemData = {
            roomId: u2uChatRoom._id,
            message,
            from,
            to,
        }

        let chat= new ChatItem(chatItemData)
        await chat.save()
        emitToRoom(u2uChatRoom.roomName,chat)

        return res.json({ success: true, message: 'Message sent successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const fetchMessages = async (req, res) => {
    try {
        
        let {from, to, type, roomId} = req.body

        if(type === 'user') {
            let chatRoom = await UserChats.findOne({ $or: [ { roomName : from+to }, { roomName: to+from } ] })
            let chats = await ChatItem.find({ roomId: chatRoom._id })

            return res.json({ success: true, chats })
        } else if (type === 'group') {
            let chatRoom = await ChatRoom.findOne({ roomId })
            let chats = await ChatItem.find({ roomId: chatRoom._id })

            return res.json({ success: true, chats })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const fetchGroupRooms = async (req, res) => {
    try {
        
        let chatRooms = await ChatRoom.find({})

        return res.json({ success: true, chatRooms })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}