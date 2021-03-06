import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    student:{
        type: Number,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timeStamps: true
})

export default mongoose.model('Notification', NotificationSchema)