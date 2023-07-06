import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const ApiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const AppId = process.env.REACT_APP_FIREBASE_APP_ID;
const AuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const ProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const StorageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const MessagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;

const firebaseConfig = {
  apiKey: ApiKey,
  authDomain: AuthDomain,
  projectId: ProjectId,
  storageBucket: StorageBucket,
  messagingSenderId: MessagingSenderId,
  appId: AppId
};

//Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}