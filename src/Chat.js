import React , {useEffect, useState} from 'react'
import "./Chat.css"
import { IconButton } from '@material-ui/core'
import { AttachFile, SearchOutlined,MoreVert, Delete } from '@material-ui/icons'
import { Avatar }  from '@material-ui/core'
import { InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import db from './firebase'
import firebase from 'firebase/compat/app'
import { useStateValue } from './StateProvider'

const ROW_CHARACTER_LIMIT = 40;

function Chat() {
    
    const [input,setInput] = useState("");
    const {roomId} =useParams();
    const [roomName,setRoomName] = useState("");
    const [seed,setSeed] = useState("");
    const [messages,setMessages] = useState([]);
    const [{ user },dispatch] = useStateValue();


    useEffect(() => {
      if (roomId) {

        db.collection("rooms")
      .doc(roomId)
      .onSnapshot((snapshot) => {
        setRoomName(snapshot.data().name); 
      });

        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .orderBy("timestamp", "asc")
          .onSnapshot((snapshot) => {
            setMessages(
              snapshot.docs.map((doc) => ({
                id: doc.id, //unique id for each message
                ...doc.data(),
              }))
            );
          });
      }
    }, [roomId]);
    



    useEffect(()=>{
      setSeed(Math.floor(Math.random()* 5000));
    },[roomId]);

    const sendMessage = (e)=>{
        e.preventDefault();
        console.log("you typed >>>",input);

        console.log(user.displayName);
        if (user.displayName && input.trim() !== "") {
          db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
              message: input,
              name: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              setInput("");
            })
            .catch((error) => {
              console.error("Error sending message: ", error);
            });
        }

    };

    const handleDelete = (messageId) => {
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .delete()
        .catch((error) => {
          console.error('Error deleting message:', error);
        });
    };


    const getRowsFromMessage = (message) => {
      const words = message.split(' ');
      const rows = [];
      let currentRow = '';
      words.forEach((word) => {
        if ((currentRow + word).length > ROW_CHARACTER_LIMIT) {
          rows.push(currentRow.trim());
          currentRow = word + ' ';
        } else {
          currentRow += word + ' ';
        }
      });
      rows.push(currentRow.trim());
      return rows;
    };



  return (
    <div className='chat'> 
        <div className='chat__header'>
             <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>

             <div className='chat__headerInfo'>
                 <h3>{roomName}</h3>
                 <p>
                  Last seen {" "}
                  {new Date(
                    messages[messages.length -1]?.timestamp?.toDate()
                  ).toUTCString()}
                 </p>
             </div>

             <div className='chat__headerRight'>
                 <IconButton>
                    <SearchOutlined/>
                 </IconButton>
                 <IconButton>
                    <AttachFile/>
                 </IconButton>
                 <IconButton>
                    <MoreVert/>
                 </IconButton>
             </div>
        </div>

        <div className='chat__body'>

            {messages.map( (message) => (
              <div 
                  className={`chat__message ${message.name===user.displayName && "chat__reciever"}`}
                  key={message.id}
                >
                <span className='chat__name'>{message.name}</span>   
                <div className="chat__messageContent">
                {getRowsFromMessage(message.message).map((row, index) => (
                <div key={index} className="chat__messageRow">
                  {row}
                </div>
              ))}
                </div>
                <span className='chat__timestamp'>
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
                {message.name === user.displayName && (
                  <IconButton
                    className='chat__deleteIcon'
                    onClick={() => handleDelete(message.id)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </div>
            ))}

        </div>

        <div className='chat__footer'>
           <InsertEmoticon />
           <form>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type a message'
              type='text'
            />
            <button 
               onClick={sendMessage}
               type='submit'>
                Send a message
            </button>
           </form>
           <MicIcon />
        </div>
    </div>
  )
}

export default Chat;