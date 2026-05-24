import mongoose from 'mongoose'


function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database is connected')
    })
    .catch((err)=>{
        console.log('there is an error occured while connecting database')
    })
}

export default connectDB


