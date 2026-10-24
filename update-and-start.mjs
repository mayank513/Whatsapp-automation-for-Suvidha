import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
import {fileURLToPath} from 'node:url';
const source=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve('C:\\Users\\DAMON\\Downloads\\Whatsapp CRM client\\MarketLoop');
const files=['update-and-start.mjs','server.mjs','sheets.mjs','sheets-adapter.mjs','GOOGLE-SHEETS.md','dist/client.js','dist/sheets-products.js'];
const prompt=createInterface({input:process.stdin,output:process.stdout});
try{
 if(process.platform!=='win32')throw Error('This updater targets the specified Windows project only.');
 if(JSON.parse(fs.readFileSync(path.join(target,'package.json'),'utf8')).name!=='marketloop')throw Error('Existing MarketLoop project not found.');
 for(const f of files)if(!fs.existsSync(path.join(source,f)))throw Error('Missing update file '+f+'. Extract the entire ZIP first.');
 console.log('Steps 9 and 10 target: '+target+'\nStop the currently running MarketLoop server with Ctrl+C.');
 if((await prompt.question('Type YES after stopping the old server to update and restart: ')).trim()!=='YES'){console.log('No files changed.');process.exitCode=1}else{
 if(path.resolve(source)!==target){const backup=path.join(target,'application-backup-release1-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex'));for(const f of files){const old=path.join(target,f);if(fs.existsSync(old)){const out=path.join(backup,f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(old,out)}}for(const f of files){const out=path.join(target,f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(source,f),out)}console.log('Application files backed up at '+backup)}
 console.log('Steps 9 and 10 installed. Your .env, database, WhatsApp sessions and dependencies were preserved. Starting the server…');
 const child=spawn(process.execPath,[path.join(target,'launch.mjs')],{cwd:target,stdio:'inherit',windowsHide:true});child.on('error',e=>console.error(e.message));child.on('exit',code=>process.exitCode=code||0);
 }
}catch(e){console.error('Update stopped: '+e.message);process.exitCode=1}finally{prompt.close()}
