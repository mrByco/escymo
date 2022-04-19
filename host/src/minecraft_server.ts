import {ServerProperties} from "./server_properties/server-properties.model";

export class MinecraftServer {

    public get port(){
        return this.config.data["port"];
    }
    public set port(value) {
        this.config.data["port"] = value;
    }

    constructor(public name: string, public id: string, public server_version: string, public config: ServerProperties){}

    static fromDocument(id: string, data: any): MinecraftServer {
        let server = new MinecraftServer(data["name"], id, data["version"], data["config"]);
        return server;
    }
}


