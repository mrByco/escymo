import {MinecraftServer} from "./minecraft_server";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import * as fs from "fs";
import {exec, ChildProcess} from "child_process";
import {getServerVersionDownloadLink} from "./helpers/server_version_helper";
import {downloadFile} from "./helpers/file_download_helper";
import {acceptEula, doesEulaExists} from "./helpers/eula_accept_helper";

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

async function checkServerFiles() {
    // @ts-ignore
    for (let server of servers.values()) {
        checkServerFolder(server);
        await checkServerJar(server);
        startServer(server);
    }
}

function checkServerProcesses() {
    console.log(`Running servers: ${server_processes.size}`);
    servers.forEach((server) => {
        if (!server_processes.has(server.id)) {
            console.log(`Server: ${server.id} is not running`);
        }
    });
}

async function checkServerJar(server: MinecraftServer) {
    if (!fs.existsSync(`${workingDirectory}/${server.id}/server.jar`)) {
        console.log(`Could not find server file for ${server.id}\nDownloading...`);
        let downloadLink: string | null = await getServerVersionDownloadLink(server.server_version, fire_db);
        if (!downloadLink) {
            console.log(`Could not find version: ${server.server_version}`);
            return;
        }
        await downloadFile(downloadLink, `${workingDirectory}/${server.id}`);
        console.log(downloadLink);
    }
}

function runServerProcess(serverDirectory: string): ChildProcess {
    let childProcess = exec(`java -Xmx1024M -Xms1024M -jar server.jar\n`, {cwd: serverDirectory}, (err, stdout, stderr) => {
        console.log("message");
        console.log(stdout);
    });
    process.on("beforeExit", () => {
        childProcess?.stdin?.write("stop");

    });
    return childProcess;
}

async function startServer(server: MinecraftServer) {
    console.log("starting");
    let serverDirectory = `${workingDirectory}/${server.id}`;
    if (!doesEulaExists(serverDirectory)){
        let p = runServerProcess(serverDirectory);
        await new Promise<void>(resolve => {
            p.on('exit', function() {
                resolve();
            })
        });
        acceptEula(serverDirectory);
    }
    let proc = runServerProcess(serverDirectory);

}

async function onSnapshot(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
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
