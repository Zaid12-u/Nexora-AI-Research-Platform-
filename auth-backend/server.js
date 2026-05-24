import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import connectDB from './db/connectdb.js'

console.log('Email:', process.env.EMAIL_USER)
console.log('Pass:', process.env.EMAIL_PASSWORD)

connectDB()

app.listen(process.env.PORT, () => {
    console.log('Server running at port 3000')
})