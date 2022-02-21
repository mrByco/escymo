import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {credential} from "firebase-admin";
import * as server_manager from "./server_manager";

let credentials = require('../fireaccess.json');

if (credentials != null){
    initializeApp({
        credential: credential.cert(credentials)
    });
}else {
    console.log("Error: No credentials for connecting to firebase");
}

server_manager.init();
