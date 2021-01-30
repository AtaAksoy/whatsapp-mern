var mongoose = require('mongoose')
const { Schema } = mongoose

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
})
module.exports = mongoose.model('messageContent', whatsappSchema)