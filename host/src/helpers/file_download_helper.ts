const fs = require('fs');
const https = require('https');

export async function downloadFile(url: string, targetFolder: string){
    return new Promise<void>((resolve) => {
        https.get(url,(res: any) => {
            const path = `${targetFolder}/server.jar`;
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on('finish',() => {
                filePath.close();
                console.log('Download Completed');
                resolve();
            });
        })
    })
}

