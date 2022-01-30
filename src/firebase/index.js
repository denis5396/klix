import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDpLMfCuKs4jQJwf_5xsNQ5VuSBPZtIDk",
  authDomain: "klix-74c29.firebaseapp.com",
  databaseURL:
    "https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "klix-74c29",
  storageBucket: "klix-74c29.appspot.com",
  messagingSenderId: "121815054131",
  appId: "1:121815054131:web:d4fc6a7fc766feb7897046",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.database();
const auth = firebase.auth();

export { auth, storage, db, firebase as default };
