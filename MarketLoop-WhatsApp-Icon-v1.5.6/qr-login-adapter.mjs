import crypto from 'node:crypto';
// The login browser is handed to the tenant after identity and access checks.
export async function connectQrLogin({onQr,onReady,onError,dataPath}){
 const w=await import('whatsapp-web.js'),QR=(await import('qrcode')).default,{Client,LocalAuth}=w.default||w;
 const profileId='login-'+crypto.randomUUID();
 const client=new Client({authStrategy:new LocalAuth({clientId:profileId,dataPath}),deviceName:'MarketLoop',qrMaxRetries:4,puppeteer:{headless:true,...(process.env.CHROME_EXECUTABLE_PATH?{executablePath:process.env.CHROME_EXECUTABLE_PATH}:{})}});
 let ended=false,ready=false;
 const stop=async()=>{if(ended)return;ended=true;try{if(ready)await client.logout()}catch{}try{await client.destroy()}catch{}};
 client.on('qr',code=>{QR.toDataURL(code,{width:280,margin:2}).then(image=>{if(!ended)onQr(image)}).catch(()=>{if(!ended)onError()})});
 client.on('ready',()=>{if(ended)return;ready=true;const phone=client.info?.wid?.user;if(/^\d{8,15}$/.test(phone||''))onReady(phone,{client,profileId,qr:QR,retain(){ended=true}});else onError()});
 client.on('auth_failure',()=>{if(!ended)onError()});client.on('disconnected',()=>{if(!ended)onError()});
 client.initialize().then(async()=>{if(ended&&!ready)try{await client.destroy()}catch{}}).catch(()=>{if(!ended)onError()});return stop;
}
