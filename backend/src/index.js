import express from 'express'
import dotenv from 'dotenv'
import  cookieparser from 'cookie-parser'
import cors from 'cors'


import { connectDB } from './lib/db.js'
import authRoutes from '../src/routes/auth.route.js'

dotenv.config()

const PORT = process.env.PORT || 4000
const app = express()



app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({extended: true}))
app.use(
    cors({
        origin:['http://localhost:5173'],
        credentials: true
    })
)


// Routes

app.use('/api/auth', authRoutes)



app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
    connectDB()
})


