import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import {SearchOutlined} from "@material-ui/icons";
import SidebarChat from './SidebarChat';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase/compat/app';
import { actionTypes } from './reducer';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';





function Sidebar() {

  const [rooms,setRooms] = useState([]);
  const [{user},dispatch] = useStateValue();
  const navigate=useNavigate();


  useEffect(()=>{
      const unsubscribe = db.collection("rooms")
      .onSnapshot((snapshot) =>{
        setRooms(
          snapshot.docs.map((doc)=>({
            id:doc.id,
            data:doc.data(),
          }))
        )
        });

      return ()=>{
        unsubscribe();
      }
  },[]);


  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };


  

  return (
    <div className='sidebar'>
      <div className='sidebar_header'>
        <Avatar src={user?.photoURL} />

        <div className='sidebar__headerRight'>
         <Tooltip title="Logout">
          <IconButton onClick={signOut}>
            <LogoutIcon />
          </IconButton>
         </Tooltip>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
            <SearchOutlined/>
            <input placeholder='Search or start new chat' type='text'/>
        </div>
      </div>

      <div className='sidebar__chats'>
        <SidebarChat addNewChat/>
        {rooms.map((room)=> (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}



export default Sidebar;
