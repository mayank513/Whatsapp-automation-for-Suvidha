import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
import {fileURLToPath} from 'node:url';
const source=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve('C:\\Users\\DAMON\\Downloads\\Whatsapp CRM client\\MarketLoop');
const files=['dist/whatsapp-chats.css','chat-provider.mjs','chat-provider.test.mjs','whatsapp-chats.mjs','whatsapp-chats.test.mjs','dist/whatsapp-chats.js','WHATSAPP-CHATS.md','update-and-start.mjs','Update-And-Start.cmd','server.mjs','database.mjs','campaigns.mjs','campaign-adapter.mjs','catalogue.mjs','ordering.mjs','order-core.mjs','fulfilment.mjs','fulfilment-adapter.mjs','fulfilment.test.mjs','launch.mjs','Start-MarketLoop.cmd','package.json','test.mjs','ui.test.mjs','ordering.test.mjs','migration.test.mjs','campaigns.test.mjs','README.md','.env.example','.gitignore','STEP4.md','STEP5.md','STEP6.md','STEP7.md','STEP8.md','STEP9.md','STEP10.md','DEPLOYMENT.md','RELEASE-STATUS.md','runtime.mjs','backup.mjs','doctor.mjs','release.test.mjs','provider.test.mjs','deploy/Caddyfile','deploy/marketloop.service','deploy/marketloop-backup.service','deploy/marketloop-backup.timer','deploy/production.env.example','admin.mjs','admin.test.mjs','dist/admin-step8.js','payments.mjs','razorpay.mjs','receipt.mjs','payments.test.mjs','payment-merchants.example.json','dist/payments-step7.js','dist/index.html','dist/client.html','sheets.mjs','sheets-adapter.mjs','sheets.test.mjs','dist/sheets-products.js','GOOGLE-SHEETS.md','dist/profile-menu.js','QR-LOGIN.md','qr-login.mjs','qr-login-adapter.mjs','qr-login.test.mjs','dist/login.html','dist/client-login.html','dist/admin-login.html','dist/portal.css','dist/portal.js','dist/qr-binding.js','dist/logout.html','dist/logout.js','dist/logout.css','dist/client.css','dist/client.js','dist/data-center.js','dist/campaign-step4.js','dist/ordering-step5.js','dist/fulfilment-step6.js'];
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
