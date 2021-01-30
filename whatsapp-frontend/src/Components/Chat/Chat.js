import { Avatar, IconButton } from '@material-ui/core'
import React, { useState } from 'react'
import './Chat.css'
import { SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MicIcon from '@material-ui/icons/Mic';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from '../../axios'
function Chat({messages}) {
    const [input, setInput] = useState("")

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post('/messages/new', {
            message: input,
            name:"DEMO_APP",
            timestamp:"Just now.",
            received: false
        })
        setInput("")
    }

    const changeValue = (e) => {
        setInput(e.target.value)
    }
    return (
        <div className="chat">
            <div className="chatHeader">
                <Avatar />
                <div className="chatHeader__info">
                    <h2>Chat Name</h2>
                    <p>Members of the chat...</p>
                </div>
                <div className="chatHeader__buttons">
                    <IconButton><SearchOutlined /></IconButton>
                    <IconButton><AttachFileIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className="chatBody">
                {messages.map(message => (
                    <p className={`chatMessage __sender ${message.received && '__reciever'}`}>
                    <span className="chat__name">{message.name}</span>

                    {message.message}

                    <span className="chat__timestamp">
                        {message.timestamp}
                    </span>
                </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input}
                    onChange={changeValue}
                    placeholder="Type a message"
                    type="text"
                    />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
