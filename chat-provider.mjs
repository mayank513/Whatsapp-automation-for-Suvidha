// Compatibility path for WhatsApp builds whose full chat serializer fails.
const fallbackClients=new WeakSet();
export async function readChatModels(page){
 return page.evaluate(()=>{
  const collection=window.require('WAWebCollections').Chat;
  return collection.getModelsArray().flatMap(chat=>{try{
   const id=chat.id?._serialized;
   if(!id||chat.isLocked)return[];
   const messages=chat.msgs?.getModelsArray?.()||[],last=messages[messages.length-1];
   return[{id:{_serialized:id},formattedTitle:String(chat.formattedTitle||chat.name||chat.contact?.name||id.split('@')[0]),isGroup:id.endsWith('@g.us'),isReadOnly:!!chat.isReadOnly,isLocked:!!chat.isLocked,unreadCount:Number(chat.unreadCount)||0,t:Number(chat.t)||Number(last?.t)||0,lastMessage:last?{id:{_serialized:last.id?._serialized||''},body:String(last.body||''),fromMe:!!last.id?.fromMe,type:String(last.type||'chat'),hasMedia:!!last.mediaData,timestamp:Number(last.t)||0}:null}];
  }catch{return[]}});
 });
}
export async function readChats(client){
 if(!fallbackClients.has(client))try{return await client.getChats()}catch{fallbackClients.add(client)}
 if(!client.pupPage)throw Error('Chat provider unavailable');
 const values=await readChatModels(client.pupPage);
 const w=await import('whatsapp-web.js'),{Chat}=w.default||w;
 return values.map(value=>{const chat=new Chat(client,{...value,lastMessage:undefined});chat.lastMessage=value.lastMessage;return chat});
}
export async function readChat(client,id){
 if(!fallbackClients.has(client))try{return await client.getChatById(id)}catch{fallbackClients.add(client)}
 return (await readChats(client)).find(chat=>chat.id?._serialized===id);
}
export async function readProfilePhoto(client,id){
 try{const url=await client.getProfilePicUrl(id);if(url)return url}catch{}
 if(!client.pupPage)return null;
 return client.pupPage.evaluate(async id=>{
  const collection=window.require('WAWebCollections').Chat;
  const chat=collection.get(id)||collection.getModelsArray().find(c=>c.id?._serialized===id);
  if(!chat||chat.isLocked)return null;
  try{const photo=await window.require('WAWebContactProfilePicThumbBridge').requestProfilePicFromServer(chat);return photo?.eurl||photo?.imgFull||photo?.img||null}catch{return null}
 },id);
}
export function validPhotoUrl(value){try{const p=new URL(value);return p.protocol==='https:'&&!p.username&&!p.password&&(!p.port||p.port==='443')&&['whatsapp.net','whatsapp.com','fbcdn.net'].some(h=>p.hostname===h||p.hostname.endsWith('.'+h))}catch{return false}}
export async function downloadProfilePhoto(url,request=fetch){
 for(let redirect=0;redirect<3;redirect++){
  if(!validPhotoUrl(url))throw Error('Invalid photo host');
  const res=await request(url,{redirect:'manual',signal:AbortSignal.timeout(8000)});
  if([301,302,303,307,308].includes(res.status)){const location=res.headers.get('location');await res.body?.cancel();url=new URL(location,url).href;continue}
  const type=res.headers.get('content-type')?.split(';')[0].toLowerCase();
  if(!res.ok||!['image/jpeg','image/png','image/webp'].includes(type)){await res.body?.cancel();throw Error('Photo unavailable')}
  const parts=[];let size=0;for await(const part of res.body){size+=part.length;if(size>2*1024*1024)throw Error('Photo too large');parts.push(part)}
  return{bytes:Buffer.concat(parts),type};
 }
 throw Error('Photo redirect limit');
}
// Return the raw WhatsApp message identifier before optional model serialization.
// Never retry a send: a serializer failure can occur after WhatsApp sent it.
export async function sendTextReceipt(client,chatId,text){
 if(!client.pupPage)return client.sendMessage(chatId,text,{sendSeen:false});
 return client.pupPage.evaluate(async(chatId,text)=>{
  const keyOf=message=>{const id=message?.id;if(typeof id==='string')return id;if(id?._serialized)return id._serialized;return typeof id?.id==='string'&&id.id?'wa:'+id.id:''};
  const chat=await window.WWebJS.getChat(chatId,{getAsModel:false});
  if(!chat||chat.isLocked||chat.isReadOnly||chatId.endsWith('@g.us'))throw Error('Chat unavailable for replies');
  const models=()=>chat.msgs?.getModelsArray?.()||[];
  const before=new Set(models().map(keyOf));const started=Math.floor(Date.now()/1000);
  const observed=()=>{const matches=models().filter(m=>m.id?.fromMe&&m.body===text&&!before.has(keyOf(m))&&keyOf(m)&&Number(m.t)>=started-1);return matches.length===1?matches[0]:null};
  let message;try{message=await window.WWebJS.sendMessage(chat,text,{linkPreview:false,parseVCards:false})}catch(error){message=observed();if(!message)throw error}
  if(!keyOf(message))message=observed();
  if(!keyOf(message))throw Error('No WhatsApp message receipt');
  return{id:{_serialized:keyOf(message)}};
 },chatId,text);
}

export function messageKey(message){const id=message?.id;if(typeof id==='string')return id;if(id?._serialized)return id._serialized;return typeof id?.id==='string'&&id.id?'wa:'+id.id:''}
