export class ServerProperties {
    constructor(public data: Map<string, string>) {}

    public static fromLines(lines: string[]) {
        let data = new Map<string, string>();
        lines.forEach((line) => {
            let keyValue = line.split("=");
            data.set(keyValue[0], keyValue[1]);
        });
        return new ServerProperties(data);
    }

    public toList(): string[]{
        let lines: string[] = [];
        this.data.forEach(((value, key) => {
            lines.push(`${key}=${value}`);
        }));
        return lines;
    }
}
