import fs from 'node:fs';
import crypto from 'node:crypto';
export function merchantConfig(owner,requestedMode){
 let map;try{map=JSON.parse(process.env.RAZORPAY_MERCHANTS_FILE?fs.readFileSync(process.env.RAZORPAY_MERCHANTS_FILE,'utf8'):(process.env.RAZORPAY_MERCHANTS_JSON||'{}'))}catch{throw Error('Server merchant configuration is invalid')}
 const m=map[owner];if(!m)throw Error('No Razorpay account is configured for this store');const mode=requestedMode||m.mode||'test';if(!['test','live'].includes(mode))throw Error('Invalid gateway mode');const p=m[mode];if(!p?.keyId?.startsWith('rzp_'+mode+'_')||!p.keySecret||!p.webhookSecret)throw Error('Configure the selected Razorpay key, secret and webhook secret on the server');return {...p,mode,enabled:process.env.PAYMENTS_ENABLED==='true'&&m.enabled===true&&(mode!=='live'||m.allowLive===true)};
}
export function validWebhook(raw,signature,profile){if(!/^[a-f0-9]{64}$/i.test(String(signature||'')))return false;return [profile.webhookSecret,...(profile.previousWebhookSecrets||[])].filter(Boolean).some(secret=>crypto.timingSafeEqual(crypto.createHmac('sha256',secret).update(raw).digest(),Buffer.from(signature,'hex')))}
export async function razorpayRequest(profile,endpoint,method='GET',payload){
 if(!/^\/payment_links(?:[/?]|$)/.test(endpoint)&&!/^\/payments\/pay_[a-zA-Z0-9]+$/.test(endpoint))throw Error('Unsupported gateway endpoint');
 let response;try{response=await fetch('https://api.razorpay.com/v1'+endpoint,{method,headers:{Authorization:'Basic '+Buffer.from(profile.keyId+':'+profile.keySecret).toString('base64'),'Content-Type':'application/json'},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(20000)})}catch{throw Error('Gateway response is uncertain. Reconcile the existing request; do not create a second link.')}
 let data;try{data=await response.json()}catch{throw Error('Gateway returned an unreadable response; reconcile before retrying')}
 if(!response.ok)throw Object.assign(Error(data.error?.description||'Gateway rejected the request'),{definite:[400,401,403,404,422].includes(response.status)});return data;
}
