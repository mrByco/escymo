import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

export async function getServerVersionDownloadLink(version: string, fsClient: Firestore): Promise<string | null>{
    try {
        let doc = await fsClient.collection("minecraft-versions").doc(version).get();
        return doc?.data()?.download;

    }
    catch (e){
        throw Error("Can not find version: " + version);
    }
}
