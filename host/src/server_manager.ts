import {MinecraftServer} from "./minecraft_server";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import * as fs from "fs";
import {exec, ChildProcess} from "child_process";
import {getServerVersionDownloadLink} from "./server_version_helper";

let fire_db: Firestore;
let servers = new Map<string, MinecraftServer>();
let server_processes = new Map<string, ChildProcess>();
const workingDirectory = "servers";

function initServerDirectory() {
    if (!fs.existsSync(workingDirectory)) {
        fs.mkdirSync(workingDirectory);
    }
}

function parseMinecraftServer(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
    let documents = snapshot.docs;
    for (let doc of documents) {
        let data = doc.data();
        servers.set(doc.id, MinecraftServer.fromDocument(doc.id, data));
        console.log(`Server loaded: ${doc.id}`);
    }
    console.log(`Server load done. Current servers: ${servers.size}`);
}

function checkServerFolder(server: MinecraftServer) {
    let serverFolder = `${workingDirectory}/${server.id}`;
    if (!fs.existsSync(serverFolder)) {
        console.log(`Created folder for: ${server.id}`);
        fs.mkdirSync(serverFolder);
    }
}

async function checkServerFiles(){
    // @ts-ignore
    for (let server of servers.values()){
        checkServerFolder(server);
        await checkServerJar(server);
    }
}

function checkServerProcesses() {
    console.log(`Running servers: ${server_processes.size}`);
    servers.forEach((server) => {
        if (!server_processes.has(server.id)){
            console.log(`Server: ${server.id} is not running`);

        }
    });
}

async function checkServerJar(server: MinecraftServer){
    if (!fs.existsSync(`${workingDirectory}/${server.id}/server.jar`)){
        console.log(`Could not find server file for ${server.id}\nDownloading...`);
        let downloadLink: string | null = await getServerVersionDownloadLink(server.server_version, fire_db);
        if (!downloadLink){
            console.log(`Could not find version: ${server.server_version}`);
        }
        console.log(downloadLink);
    }
}

function startServer(server: MinecraftServer){

}

async function onSnapshot(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>){
    parseMinecraftServer(snapshot);
    await checkServerFiles();
    checkServerProcesses();
}

function subscribeToServerChanges() {
    fire_db = getFirestore();
    fire_db.collection("servers").onSnapshot(onSnapshot);
}

export async function init() {
    initServerDirectory();
    subscribeToServerChanges();
}
