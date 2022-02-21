import * as fs from "fs";

export function acceptEula(directory: string){
    try {
        console.log(`Accepting eula: ${directory}`);
        let data = fs.readFileSync(`${directory}/eula.txt`, 'utf8');
        data = data.replace("eula=false", "eula=true");
        fs.writeFile(`${directory}/eula.txt`, data, function (err) {
            if (err) return console.log(err);
        });
        console.log(data);
    } catch (err) {
        console.error(err)
    }
}

export function doesEulaExists(directory: string): boolean {
    return fs.existsSync(`${directory}/eula.txt`);
}
