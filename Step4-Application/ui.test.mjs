import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('local HTML loads adjacent assets and never attempts backend authentication from file URLs',()=>{
 const html=fs.readFileSync(new URL('./dist/client.html',import.meta.url),'utf8');
 for(const file of ['client.css','client.js','data-center.js','campaign-step4.js'])assert.ok(html.includes('./'+file));
 const elements=new Map();const element=selector=>{if(!elements.has(selector))elements.set(selector,{});return elements.get(selector)};
 let requests=0;const context={document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener(){}},location:{protocol:'file:'},fetch(){requests++;throw Error('File previews must not call the backend')}};
 vm.runInNewContext(fs.readFileSync(new URL('./dist/client.js',import.meta.url),'utf8'),context);
 assert.equal(requests,0);assert.equal(element('#login-form').hidden,true);
 assert.match(element('#auth-error').innerHTML,/Start-MarketLoop.cmd/);
 assert.match(element('#auth-error').innerHTML,/http:\/\/127.0.0.1:3080\/client/);
});
