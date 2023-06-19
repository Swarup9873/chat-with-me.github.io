import React from 'react'
import { Button } from '@material-ui/core'
import "./Login.css"
import {auth} from "./firebase"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import whatsappLogo from './images/whatsapp_logo.webp'



function Login() {

    const [{},dispatch] = useStateValue();

  const signIn = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider)
    .then((result) => {
        dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
        });
    })
    .catch((error) => alert(error.message));
  }; 


  return (
    <div className='login'>
        <div className='login__container'>
            <img src={whatsappLogo} alt='' />
            <div className='login__text'>
                <h1>Sign in to Whatsapp</h1>
            </div>

            <Button onClick={signIn}>
                Sign in with Google
            </Button>
        </div>
    </div>
  )
}

export default Login