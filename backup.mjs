import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {DatabaseSync,backup} from 'node:sqlite';
import {pathToFileURL} from 'node:url';
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const checkDb=file=>{const db=new DatabaseSync(file,{readOnly:true});try{if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('Database integrity check failed')}finally{db.close()}};
export async function createBackup(dataDir,backupRoot){
 const source=path.resolve(dataDir),root=path.resolve(backupRoot),dbFile=path.join(source,'marketloop.sqlite');
 if(!fs.existsSync(dbFile))throw Error('Source database does not exist');
 if(root===source||root.startsWith(source+path.sep))throw Error('Backups must be outside the application data directory');
 fs.mkdirSync(root,{recursive:true,mode:0o700});const output=fs.mkdtempSync(path.join(root,'marketloop-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'));const db=new DatabaseSync(dbFile,{readOnly:true});
 try{await backup(db,path.join(output,'marketloop.sqlite'))}finally{db.close()}
 checkDb(path.join(output,'marketloop.sqlite'));
 const snapshot=new DatabaseSync(path.join(output,'marketloop.sqlite'),{readOnly:true});let files;try{files=snapshot.prepare('SELECT id FROM files').all()}finally{snapshot.close()}
 for(const {id} of files){if(!/^[a-f0-9-]{36}$/i.test(id))throw Error('Unexpected PDF identifier in database');const name=id+'.pdf';fs.copyFileSync(path.join(source,name),path.join(output,name))}
 const names=['marketloop.sqlite',...files.map(f=>f.id+'.pdf')];const manifest={format:1,createdAt:new Date().toISOString(),files:names.map(name=>({name,sha256:hash(path.join(output,name))})),excluded:['.env','merchant credentials','WhatsApp browser sessions'],complete:true};fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2),{mode:0o600});return output;
}
export function restoreBackup(backupDir,destination){
 const source=path.resolve(backupDir),target=path.resolve(destination),manifest=JSON.parse(fs.readFileSync(path.join(source,'manifest.json'),'utf8'));
 if(manifest.format!==1||manifest.complete!==true||!Array.isArray(manifest.files)||!manifest.files.some(f=>f.name==='marketloop.sqlite'))throw Error('Incomplete or unsupported backup');
 const seen=new Set();for(const f of manifest.files){if(seen.has(f.name)||!(f.name==='marketloop.sqlite'||/^[a-f0-9-]{36}\.pdf$/i.test(f.name))||!(/^[a-f0-9]{64}$/.test(f.sha256)))throw Error('Invalid backup manifest');seen.add(f.name);if(hash(path.join(source,f.name))!==f.sha256)throw Error('Backup checksum mismatch: '+f.name)}
 checkDb(path.join(source,'marketloop.sqlite'));
 if(fs.existsSync(target)&&fs.readdirSync(target).length)throw Error('Restore destination must be empty; stop the server and choose a new data directory');
 fs.mkdirSync(target,{recursive:true,mode:0o700});for(const f of manifest.files)fs.copyFileSync(path.join(source,f.name),path.join(target,f.name));const db=new DatabaseSync(path.join(target,'marketloop.sqlite'));try{db.exec('PRAGMA foreign_keys=ON; DELETE FROM sessions')}finally{db.close()}return target;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{const [command,source,target]=process.argv.slice(2);if(!source||!target||!['create','restore'].includes(command))throw Error('Usage: node backup.mjs create DATA_DIR BACKUP_ROOT | restore BACKUP_DIR EMPTY_DATA_DIR');console.log(command==='create'?await createBackup(source,target):restoreBackup(source,target))}catch(e){console.error('Backup operation failed: '+e.message);process.exitCode=1}}
