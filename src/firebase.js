import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATUzwMfvmEG_4pdq3s9kChpEj0ESf86mg",
  authDomain: "whatsapp-clone-3bd40.firebaseapp.com",
  projectId: "whatsapp-clone-3bd40",
  storageBucket: "whatsapp-clone-3bd40.appspot.com",
  messagingSenderId: "204748438957",
  appId: "1:204748438957:web:55b64da1990e256568b524"
};


  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();
  //const provider=firebase.auth.GoogleAuthProvider();
  


  export {auth};
  export default db;