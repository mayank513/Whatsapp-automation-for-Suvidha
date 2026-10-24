import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {configureCommerce} from './database.mjs';
test('migrates existing store records without losing orders, and rolls back invalid writes',()=>{
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON; CREATE TABLE stores(owner TEXT PRIMARY KEY,data TEXT NOT NULL)');
 const d={rev:3,settings:{name:'Existing shop'},products:[{id:'p',name:'Rice',unit:'1 kg',price:90,stock:12}],customers:[{id:'c',name:'Existing customer',phone:'919999999999'}],orders:[{id:'o',number:'#1001',at:'2026-10-17T00:00:00Z',status:'New',deliveryFee:10,items:[{productId:'p',name:'Rice',unit:'1 kg',price:90,qty:2}],payment:'Paid',paymentRecordedAt:'2026-10-17T00:01:00Z',paymentSource:'manual',paymentReference:'cash-1'}]};
 db.prepare('INSERT INTO stores VALUES(?,?)').run('owner',JSON.stringify(d));const c=configureCommerce(db);
 const load=()=>c.read('owner',JSON.parse(db.prepare('SELECT data FROM stores WHERE owner=?').get('owner').data));
 assert.deepEqual(load(),d);assert.equal(c.summary('owner').counts.order_items,1);assert.equal(c.summary('owner').paymentHistory[0].amountPaise,19000);
 configureCommerce(db);assert.deepEqual(load(),d); // Idempotent startup migration.
 const bad=structuredClone(d);bad.products[0].stock=-5;
 assert.throws(()=>c.commit('owner',bad));assert.deepEqual(load(),d);
 db.exec('CREATE TABLE transaction_probe(value TEXT)');const invalidHook=structuredClone(d);invalidHook.products[0].price=75;
 assert.throws(()=>c.commit('owner',invalidHook,()=>{db.prepare('INSERT INTO transaction_probe VALUES(?)').run('queued notification');throw Error('Outbox write failed')}),/Outbox write failed/);
 assert.deepEqual(load(),d);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM transaction_probe').get().n,0);
 const next=structuredClone(d);next.orders[0].payment='Refunded';next.orders[0].paymentRecordedAt='2026-10-18T00:01:00Z';c.commit('owner',next);assert.equal(c.summary('owner').counts.payments,2);
 assert.equal(c.summary('another-owner').counts.products,0);db.close();
});
