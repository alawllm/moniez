//AUTHENTICATION
import { initializeApp } from 'firebase/app';
//importing firebase microlibrarie

import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    //observable listener - hooking in into a stream of events
    onAuthStateChanged
} from 'firebase/auth'

//FIRESTORE
import {
    getFirestore,
    //retrieves documents from the database
    doc,
    //getting the document's data - data ON the document
    getDoc,
    //setting the document's data
    setDoc
} from 'firebase/firestore'

//firebase configuration - connecting database to my app
const firebaseConfig = {
    //this API key is not a secret one - can be exposed
    apiKey: "AIzaSyDGegtdlP2c5ylHlvSrhfaf5v8RbTmqBws",
    authDomain: "finance-app-96b77.firebaseapp.com",
    projectId: "finance-app-96b77",
    storageBucket: "finance-app-96b77.appspot.com",
    messagingSenderId: "760796879529",
    appId: "1:760796879529:web:54e16f54f2eeb5fb8367b8"
};

// initialize Firebase
//every CRUD action happens using this firebaseApp instance
const firebaseApp = initializeApp(firebaseConfig);

//gives back provider instance
const provider = new GoogleAuthProvider();

//telling GoogleAuthProvider how to behave
provider.setCustomParameters({
    //every time someone interacts with the provider, they should select the account
    prompt: "select_account"
})

//always just one case of authentication
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const signInWithGoogleRedirect = () => {
    signInWithRedirect(auth, provider);
}

//direct pointer to the database
export const db = getFirestore();

//creating user reference in the database
export const createUserDocumentFromAuth = async (
    userAuth,
    additionalInformation = {}
) => {
    if (!userAuth) return;
    //checking if there is an existing user reference
    //takes in database, collection and unique id
    const userDocRef = doc(db, 'users', userAuth.uid);

    //get user data from the firestore database
    const userSnapshot = await getDoc(userDocRef);

    //if userData does not exist, create/ set the document with the data from userAuth
    //data saved in the collection in the firestore database
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        //new date object
        const createdAt = new Date();
        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            })
        } catch (error) {
            console.log('error creating the user', error.message)
        }
    }
}

//creating auth user with email and password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return createUserWithEmailAndPassword(auth, email, password);
}

//signing auth user with email and password
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return signInWithEmailAndPassword(auth, email, password);
}


export const signOutUser = async () => await signOut(auth);

//returns observer listener
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);