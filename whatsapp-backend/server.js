var express = require('express')
var mongoose = require('mongoose')
const { default: dbMessages } = require('./dbMessages')
const Pusher = require("pusher");
var cors = require('cors')

const app = express()
const port = process.env.PORT || 9000
const pusher = new Pusher({
    appId: "1147372",
    key: "c2b2a01b0447162b025c",
    secret: "8970aa9bf2cce88f2340",
    cluster: "eu",
    useTLS: true
});

var Messages = require('./dbMessages')



app.use(express.json())

const connection_url = 'mongodb+srv://admin:hXoTKryKi6o7CeCe@cluster0.cquhh.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.once('open', () => {
    console.log('DB is connected!')

    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()
    changeStream.on('change', (change) => {
        console.log(change)
        if (change.operationType == 'insert'){
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else {
            console.log("Error triggering pusher!")
        }
    })
})

app.use(cors())

app.get('/', (req, res) => res.status(200).send('Hello World!'))
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err){
            res.status(500).send(err)
        }else {
            res.status(200).send(data)
        }
    })
})
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }else {
            res.status(201).send(data)
        }
    })
})


app.listen(port, () => console.log(`started on: localhost:${port}`))
