export class MinecraftServer {
    constructor(public name: string, public id: string, public server_version: string, public port: number, public config: any){}

    static fromDocument(id: string, data: any): MinecraftServer {
        let server = new MinecraftServer(data["name"], id, data["version"], data["port"], data["config"]);
        return server;
    }
}


