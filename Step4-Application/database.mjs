// Tenant-scoped relational storage. Store JSON retains settings and messaging data;
// these five tables are authoritative for commerce records after migration.
export function configureCommerce(db) {
 db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS products(owner TEXT NOT NULL REFERENCES stores(owner),id TEXT NOT NULL,name TEXT NOT NULL,unit TEXT NOT NULL,price_paise INTEGER NOT NULL CHECK(price_paise>=0),stock REAL NOT NULL CHECK(stock>=0),data TEXT NOT NULL,PRIMARY KEY(owner,id));
 CREATE TABLE IF NOT EXISTS customers(owner TEXT NOT NULL REFERENCES stores(owner),id TEXT NOT NULL,name TEXT NOT NULL,phone TEXT NOT NULL,marketing_consent INTEGER NOT NULL CHECK(marketing_consent IN(0,1)),data TEXT NOT NULL,PRIMARY KEY(owner,id));
 CREATE TABLE IF NOT EXISTS orders(owner TEXT NOT NULL REFERENCES stores(owner),id TEXT NOT NULL,number TEXT NOT NULL,status TEXT NOT NULL,total_paise INTEGER NOT NULL CHECK(total_paise>=0),created_at TEXT NOT NULL,data TEXT NOT NULL,PRIMARY KEY(owner,id),UNIQUE(owner,number));
 CREATE TABLE IF NOT EXISTS order_items(owner TEXT NOT NULL,order_id TEXT NOT NULL,line INTEGER NOT NULL,product_id TEXT NOT NULL,name TEXT NOT NULL,unit TEXT NOT NULL,quantity REAL NOT NULL CHECK(quantity>0),unit_price_paise INTEGER NOT NULL CHECK(unit_price_paise>=0),data TEXT NOT NULL,PRIMARY KEY(owner,order_id,line),FOREIGN KEY(owner,order_id) REFERENCES orders(owner,id) ON DELETE CASCADE);
 CREATE TABLE IF NOT EXISTS payments(owner TEXT NOT NULL,order_id TEXT NOT NULL,recorded_at TEXT NOT NULL,status TEXT NOT NULL,amount_paise INTEGER NOT NULL CHECK(amount_paise>=0),source TEXT NOT NULL,reference TEXT NOT NULL,PRIMARY KEY(owner,order_id,recorded_at),FOREIGN KEY(owner,order_id) REFERENCES orders(owner,id));
 CREATE INDEX IF NOT EXISTS products_owner_name ON products(owner,name);
 CREATE INDEX IF NOT EXISTS customers_owner_phone ON customers(owner,phone);
 CREATE INDEX IF NOT EXISTS orders_owner_date ON orders(owner,created_at);
 CREATE INDEX IF NOT EXISTS payments_owner_date ON payments(owner,recorded_at);`);
 const paise=n=>{if(!Number.isFinite(n)||n<0||n>1e10)throw Error('Invalid money amount');return Math.round(n*100)};
 const total=o=>o.items.reduce((s,i)=>s+Math.round(paise(i.price)*i.qty),0)+paise(Number(o.deliveryFee||0));
 function write(owner,d){
  // Caller owns the transaction, so store revisions, stock and order lines commit together.
  db.prepare('DELETE FROM order_items WHERE owner=?').run(owner);
  db.prepare('DELETE FROM products WHERE owner=?').run(owner);
  db.prepare('DELETE FROM customers WHERE owner=?').run(owner);
  for(const p of d.products)db.prepare('INSERT INTO products VALUES(?,?,?,?,?,?,?)').run(owner,p.id,p.name,p.unit||'',paise(p.price),p.stock,JSON.stringify(p));
  for(const c of d.customers)db.prepare('INSERT INTO customers VALUES(?,?,?,?,?,?)').run(owner,c.id,c.name,c.phone,c.marketingConsent?1:0,JSON.stringify(c));
  for(const o of d.orders){
   const {items,...header}=o;
   db.prepare(`INSERT INTO orders VALUES(?,?,?,?,?,?,?) ON CONFLICT(owner,id) DO UPDATE SET number=excluded.number,status=excluded.status,total_paise=excluded.total_paise,created_at=excluded.created_at,data=excluded.data`).run(owner,o.id,o.number,o.status,total(o),o.at,JSON.stringify(header));
   items.forEach((i,line)=>db.prepare('INSERT INTO order_items VALUES(?,?,?,?,?,?,?,?,?)').run(owner,o.id,line,i.productId,i.name,i.unit||'',i.qty,paise(i.price),JSON.stringify(i)));
   if(o.paymentRecordedAt)db.prepare('INSERT OR IGNORE INTO payments VALUES(?,?,?,?,?,?,?)').run(owner,o.id,o.paymentRecordedAt,o.payment||'Unpaid',total(o),o.paymentSource||'manual',o.paymentReference||'');
  }
 }
 const migration=db.prepare('SELECT version FROM schema_migrations WHERE version=1').get();
 if(!migration){db.exec('BEGIN IMMEDIATE');try{for(const s of db.prepare('SELECT owner,data FROM stores').all()){const d=JSON.parse(s.data);write(s.owner,d);db.prepare('UPDATE stores SET data=? WHERE owner=?').run(JSON.stringify({...d,products:[],customers:[],orders:[]}),s.owner)}db.prepare('INSERT INTO schema_migrations VALUES(1,?)').run(new Date().toISOString());db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
 function read(owner,d){d.products=db.prepare('SELECT data FROM products WHERE owner=? ORDER BY rowid').all(owner).map(r=>JSON.parse(r.data));d.customers=db.prepare('SELECT data FROM customers WHERE owner=? ORDER BY rowid').all(owner).map(r=>JSON.parse(r.data));d.orders=db.prepare('SELECT id,data FROM orders WHERE owner=? ORDER BY created_at,id').all(owner).map(r=>({...JSON.parse(r.data),items:db.prepare('SELECT data FROM order_items WHERE owner=? AND order_id=? ORDER BY line').all(owner,r.id).map(i=>JSON.parse(i.data))}));return d}
 function commit(owner,d){db.exec('BEGIN IMMEDIATE');try{write(owner,d);db.prepare('UPDATE stores SET data=? WHERE owner=?').run(JSON.stringify({...d,products:[],customers:[],orders:[]}),owner);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
 function summary(owner){return {schemaVersion:1,engine:'SQLite',storage:'Server database',counts:Object.fromEntries(['products','customers','orders','order_items','payments'].map(t=>[t,db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE owner=?`).get(owner).n])),paymentHistory:db.prepare('SELECT order_id AS orderId,recorded_at AS recordedAt,status,amount_paise AS amountPaise,source,reference FROM payments WHERE owner=? ORDER BY recorded_at DESC').all(owner)}}
 return {read,commit,summary};
}
