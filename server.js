import express from 'express'
import bodyParser from 'body-parser'
import CORS from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import config from './config/config.cjs'
import { createSocketServer } from './config/socketConnect.js'
import appRoutes from './routes/app.routes.js'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(CORS({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
app.use(express.static('./public'))

app.use('/api', appRoutes)

const server = http.createServer(app)
createSocketServer(server)

mongoose.connect(config.MONGO_URI).then(() => {
    console.log('Database connection successful')
    server.listen(5000, () => {
        console.log('Server runs on port 5000...')
    })
}).catch(err => {
    console.error('Error connecting database', err)
})
