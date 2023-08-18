import express from 'express'
import * as appController from '../controllers/app.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/api-test', appController)

router.route('/user')
    .get(authMiddleware, appController.userInfo)
    .post(appController.createUser)

router.route('/user-list')
    .get(authMiddleware, appController.userList)

router.route('/signin')
    .post(appController.signin)

router.route('/create-room')
    .post(authMiddleware, appController.createRoom)

router.route('/send-message')
    .post(authMiddleware, appController.sendMessage)

router.route('/chat-rooms')
    .post(authMiddleware, appController.fetchGroupRooms)

router.route('/fetch-messages')
    .post(authMiddleware, appController.fetchMessages)

export default router