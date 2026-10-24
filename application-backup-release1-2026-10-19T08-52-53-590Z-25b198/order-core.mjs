import crypto from 'node:crypto';
export const rupees=n=>'INR '+Number(n).toFixed(2);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function quoteOrder(d,b){
 const c=d.customers.find(x=>x.id===b.customerId);if(!c)throw Error('Choose a saved customer');
 if(!Array.isArray(b.items)||!b.items.length||b.items.length>100)throw Error('Choose 1-100 order items');
 const grouped=new Map();for(const i of b.items){if(!Number.isFinite(i.qty)||i.qty<=0||i.qty>100000||Math.abs(i.qty*1000-Math.round(i.qty*1000))>0.00001)throw Error('Use a positive quantity with at most 3 decimal places');grouped.set(i.productId,roundQty((grouped.get(i.productId)||0)+i.qty))}
 const items=[];for(const [pid,qty] of grouped){const p=d.products.find(x=>x.id===pid);if(!p)throw Error('A selected product is no longer available');if(qty>p.stock)throw Error(`Only ${p.stock} pack(s) of ${p.name} (${p.unit}) are available. Reply EDIT to change your order.`);items.push({productId:pid,name:p.name,unit:p.unit,price:p.price,qty})}
 const subtotal=round(items.reduce((s,i)=>s+round(i.qty*i.price),0));if(subtotal<Number(d.settings.minimum||0))throw Error('Minimum order is '+rupees(d.settings.minimum)+'. Reply EDIT to change your items.');
 const fulfilment=b.fulfilment==='Store pickup'?'Store pickup':'Delivery';
 const fee=b.deliveryFee===undefined?Number(d.settings.deliveryFee||0):b.deliveryFee;if(!Number.isFinite(fee)||fee<0)throw Error('Invalid delivery fee');
 const deliveryFee=fulfilment==='Store pickup'||Number(d.settings.freeAbove)>0&&subtotal>=Number(d.settings.freeAbove)?0:fee;
 return {customerId:c.id,customerSnapshot:{name:c.name,phone:c.phone,address:c.address||'',postcode:c.postcode||''},items,subtotal,deliveryFee,total:round(subtotal+deliveryFee),fulfilment,slot:String(b.slot||'').slice(0,250),paymentPreference:String(b.paymentPreference||'').slice(0,80)};
}
export const roundQty=n=>Math.round(n*1000)/1000;
export function commitOrder(d,b,{load,save,owner,checkoutKey}={}){
 if(checkoutKey){const previous=d.orders.find(o=>o.checkoutKey===checkoutKey);if(previous)return previous}
 const q=quoteOrder(d,b);for(const i of q.items){const p=d.products.find(x=>x.id===i.productId);p.stock=roundQty(p.stock-i.qty)}
 const o={...q,id:crypto.randomUUID(),number:'#'+String(d.orders.length+1001),at:new Date().toISOString(),status:'New',payment:'Unpaid',...(checkoutKey?{checkoutKey,source:'WhatsApp assistant'}:{})};d.orders.push(o);save(owner,d);return o;
}
