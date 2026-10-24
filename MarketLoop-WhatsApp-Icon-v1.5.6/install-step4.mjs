import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createInterface} from 'node:readline/promises';
const target=path.resolve('C:\\Users\\DAMON\\Downloads\\Whatsapp CRM client\\MarketLoop');
const here=path.dirname(fileURLToPath(import.meta.url));
const files=['launch.mjs','Start-MarketLoop.cmd','server.mjs','database.mjs','campaigns.mjs','campaign-adapter.mjs','catalogue.mjs','package.json','test.mjs','ui.test.mjs','migration.test.mjs','campaigns.test.mjs','README.md','.env.example','STEP4.md','dist/index.html','dist/client.html','dist/client.js','dist/client.css','dist/data-center.js','dist/campaign-step4.js'];
const prompt=createInterface({input:process.stdin,output:process.stdout});
try{
 if(process.platform!=='win32')throw Error('This installer is for the specified Windows project only.');
 if(JSON.parse(fs.readFileSync(path.join(target,'package.json'),'utf8')).name!=='marketloop')throw Error('The target folder is not a MarketLoop project');
 const payload=path.join(here,'Step4-Application.zip');if(!fs.existsSync(payload))throw Error('Keep Step4-Application.zip beside this installer.');
 console.log('Installing step 4 into: '+target+'\nStop the MarketLoop server with Ctrl+C before continuing.');
 if((await prompt.question('Has the server stopped? Type YES to install: ')).trim()!=='YES'){console.log('No files changed.');process.exitCode=1}else{
 const stage=fs.mkdtempSync(path.join(os.tmpdir(),'MarketLoop-Step4-'));
 const unzip=spawnSync('powershell.exe',['-NoProfile','-Command','Expand-Archive -LiteralPath $env:ML_STEP4_ZIP -DestinationPath $env:ML_STEP4_STAGE'],{env:{...process.env,ML_STEP4_ZIP:payload,ML_STEP4_STAGE:stage},encoding:'utf8',windowsHide:true});
 if(unzip.status!==0)throw Error('Could not extract update: '+(unzip.stderr||unzip.error?.message||''));
 for(const f of files)if(!fs.existsSync(path.join(stage,f)))throw Error('Missing update file '+f);
 const backup=path.join(target,'application-backup-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex'));
 for(const f of files){const current=path.join(target,f);if(fs.existsSync(current)){const out=path.join(backup,f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(current,out)}}
 for(const f of files){const out=path.join(target,f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(stage,f),out)}
 console.log('Step 4 installed.\nPrevious app files: '+backup+'\n.env, data, PDFs, sessions and node_modules were preserved.\n\nNext, inside the project folder run:\n  Start-MarketLoop.cmd\n\nOpen http://127.0.0.1:3080/client → Daily PDFs & offers.\nSending stays OFF until CAMPAIGN_WORKER_ENABLED=true is set in .env.');
 }
}catch(e){console.error('Installation stopped: '+e.message);process.exitCode=1}finally{prompt.close()}
