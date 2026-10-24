import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
if(Number(process.versions.node.split('.')[0])<24){console.error('Install Node.js 24 or newer, then run Start-MarketLoop.cmd again.');process.exit(1)}
if(!fs.existsSync('.env'))fs.copyFileSync('.env.example','.env');
const run=command=>new Promise((resolve,reject)=>{const p=spawn('cmd.exe',['/d','/s','/c',command],{cwd:root,stdio:'inherit',windowsHide:true});p.once('error',reject);p.once('exit',code=>code===0?resolve():reject(Error('Dependency installation failed. Check the error above.')))});
try{
 try{import.meta.resolve('pdfkit');import.meta.resolve('qrcode');import.meta.resolve('whatsapp-web.js')}catch{console.log('Installing application dependencies. Internet access is required.');await run('npm.cmd install')}
 const child=spawn(process.execPath,['--env-file-if-exists=.env','server.mjs'],{cwd:root,stdio:'inherit',windowsHide:true});
 child.on('error',e=>{console.error(e.message);process.exitCode=1});
 child.on('exit',code=>{process.exitCode=code||0});
 let finished=false;child.once('exit',()=>finished=true);
 let port=3080;const env=fs.readFileSync('.env','utf8');const match=env.match(/^PORT\s*=\s*["']?(\d+)/m);if(match)port=Number(match[1]);
 const address=`http://127.0.0.1:${port}/login`;
 const ready=()=>new Promise(resolve=>{const req=http.get(`http://127.0.0.1:${port}/api/health`,res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>{try{resolve(res.statusCode===200&&JSON.parse(data).ok===true)}catch{resolve(false)}})});req.setTimeout(1000,()=>req.destroy());req.on('error',()=>resolve(false))});
 for(let n=0;n<40&&!finished;n++){if(await ready()){console.log('Dashboard ready: '+address+'\nKeep this window open while using MarketLoop.');const browser=spawn('cmd.exe',['/d','/c','start','',address],{windowsHide:true,stdio:'ignore'});browser.on('error',()=>console.log('Open '+address+' in Chrome.'));break}await new Promise(r=>setTimeout(r,500))}
 if(!finished)console.log('If the browser did not open, visit '+address);
}catch(e){console.error(e.message);process.exitCode=1}
