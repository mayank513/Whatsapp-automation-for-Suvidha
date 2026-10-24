if(location.protocol!=='file:'&&new URLSearchParams(location.search).has('sheets'))view='products';
const supermarketTemplateProducts=`RICE-001|Basmati rice|India Gate|kg|180
RICE-002|Sona masoori rice|Local select|kg|72
RICE-003|Kolam rice|Daawat|kg|78
RICE-004|Wheat flour atta|Aashirvaad|kg|58
RICE-005|Whole wheat flour|Pillsbury|kg|62
RICE-006|Maida refined flour|Fortune|kg|48
RICE-007|Besan gram flour|Tata Sampann|kg|110
RICE-008|Poha thick|Local select|kg|55
RICE-009|Suji semolina|Local select|kg|52
RICE-010|Corn flour|Weikfield|kg|95
DAL-001|Toor dal|Tata Sampann|kg|168
DAL-002|Moong dal split|Tata Sampann|kg|145
DAL-003|Masoor dal|Local select|kg|112
DAL-004|Chana dal|Local select|kg|98
DAL-005|Urad dal split|Tata Sampann|kg|138
DAL-006|Kabuli chana|Local select|kg|130
DAL-007|Kala chana|Local select|kg|92
DAL-008|Rajma red|Tata Sampann|kg|155
DAL-009|Green moong whole|Local select|kg|118
DAL-010|White peas dried|Local select|kg|88
SPC-001|Turmeric powder|Everest|100 g|38
SPC-002|Red chilli powder|Everest|100 g|52
SPC-003|Coriander powder|Catch|100 g|36
SPC-004|Cumin seeds|Catch|100 g|62
SPC-005|Mustard seeds|Local select|100 g|28
SPC-006|Garam masala|MDH|100 g|78
SPC-007|Black pepper whole|Everest|50 g|68
SPC-008|Cardamom green|Local select|25 g|95
SPC-009|Cinnamon sticks|Local select|50 g|48
SPC-010|Chaat masala|MDH|100 g|42
OIL-001|Sunflower oil|Fortune|1 L|145
OIL-002|Mustard oil|Fortune|1 L|168
OIL-003|Refined soybean oil|Fortune|1 L|142
OIL-004|Groundnut oil|Dhara|1 L|190
OIL-005|Ghee|Amul|500 ml|310
OIL-006|Iodized salt|Tata Salt|1 kg|28
OIL-007|White sugar|Madhur|1 kg|48
OIL-008|Jaggery powder|Local select|500 g|55
OIL-009|Vinegar white|Synthetic|1 L|48
OIL-010|Tomato ketchup|Kissan|500 g|105
SNK-001|Salted potato chips|Lay's|52 g|20
SNK-002|Masala potato chips|Bingo|52 g|20
SNK-003|Glucose biscuits|Parle-G|100 g|10
SNK-004|Marie biscuits|Britannia|120 g|25
SNK-005|Cream biscuits|Sunfeast|120 g|30
SNK-006|Salted crackers|Monaco|200 g|40
SNK-007|Namkeen mixture|Haldiram's|200 g|65
SNK-008|Roasted peanuts|Local select|200 g|55
SNK-009|Instant noodles|Maggi|70 g|15
SNK-010|Popcorn salted|Act II|60 g|30
BEV-001|Tea leaves|Tata Tea|250 g|145
BEV-002|Instant coffee|Bru|100 g|165
BEV-003|Green tea bags|Organic India|25 bags|155
BEV-004|Mango drink|Maaza|600 ml|40
BEV-005|Cola drink|Coca-Cola|750 ml|45
BEV-006|Lemon soda|Sprite|750 ml|45
BEV-007|Packaged drinking water|Bisleri|1 L|20
BEV-008|Orange drink|Frooti|600 ml|40
BEV-009|Malted drink powder|Bournvita|500 g|245
BEV-010|Coconut water|Paper Boat|200 ml|40
DAI-001|Toned milk|Amul|1 L|68
DAI-002|Full cream milk|Amul|1 L|76
DAI-003|Curd|Mother Dairy|400 g|38
DAI-004|Paneer|Amul|200 g|95
DAI-005|Butter|Amul|100 g|58
DAI-006|Cheese slices|Britannia|200 g|135
DAI-007|Fresh eggs|Farm fresh|6 pcs|48
DAI-008|White bread|Britannia|400 g|45
DAI-009|Brown bread|Harvest Gold|400 g|55
DAI-010|Sweet lassi|Amul|200 ml|25
CLN-001|Dishwash bar|Vim|200 g|30
CLN-002|Dishwash liquid|Vim|500 ml|115
CLN-003|Laundry detergent powder|Surf Excel|1 kg|220
CLN-004|Laundry detergent powder|Rin|1 kg|125
CLN-005|Laundry soap bar|Rin|250 g|32
CLN-006|Floor cleaner|Lizol|500 ml|115
CLN-007|Toilet cleaner|Harpic|500 ml|105
CLN-008|Household bleach|Presto|500 ml|48
CLN-009|Garbage bags medium|HomeCare|30 pcs|85
CLN-010|Scrub sponge|Scotch-Brite|1 pc|30
CARE-001|Bathing soap|Dove|100 g|58
CARE-002|Bathing soap|Lifebuoy|100 g|32
CARE-003|Shampoo|Clinic Plus|340 ml|155
CARE-004|Hair oil|Parachute|200 ml|115
CARE-005|Toothpaste|Colgate|150 g|105
CARE-006|Toothbrush medium|Oral-B|1 pc|45
CARE-007|Handwash refill|Dettol|750 ml|115
CARE-008|Sanitary pads|Whisper|7 pcs|45
CARE-009|Talcum powder|Pond's|100 g|95
CARE-010|Petroleum jelly|Vaseline|100 ml|115
HOME-001|Aluminium foil|Freshwrapp|9 m|75
HOME-002|Food storage containers|Signoraware|3 pcs|180
HOME-003|Matchbox|Aim|1 box|2
HOME-004|Candle pack|Mangaldeep|6 pcs|25
HOME-005|Mosquito repellent refill|Good Knight|45 ml|78
HOME-006|Mosquito coil|Mortein|10 pcs|42
HOME-007|LED bulb 9W|Wipro|1 pc|95
HOME-008|Batteries AA|Duracell|2 pcs|55
HOME-009|Paper napkins|Origami|100 pcs|48
HOME-010|Reusable shopping bag|MarketLoop|1 pc|25`.split('\n').map((line,index)=>{const[sku,name,brand,unit,price]=line.split('|');return{sku,name,brand,unit,price:Number(price),stock:12+(index*7)%39,lowStock:5}});
const productsBeforeSheets=products;
async function loadGoogleSpreadsheetOptions(selectId,selectedValue){const select=$('#'+selectId);if(!select)return;const id=String(selectedValue||'').match(/\/spreadsheets\/d\/([\w-]+)/)?.[1]||String(selectedValue||'').trim();select.innerHTML='<option value="">Loading your Google Sheets…</option>';try{const result=await api('/sheets/files');const files=Array.isArray(result.files)?result.files:[];if(id&&!files.some(file=>file.id===id))files.unshift({id,name:'Saved spreadsheet (not listed)'});select.innerHTML='<option value="">Choose a Google spreadsheet</option>'+files.map(file=>`<option value="${esc(file.id)}">${esc(file.name)}</option>`).join('');if(id)select.value=id;if(!files.length)select.innerHTML='<option value="">No Google spreadsheets found</option>'}catch(error){select.innerHTML='<option value="">Could not load list — reconnect Google</option>';select.title=error.message}}
async function loadGoogleSheetTabs(spreadsheet,selectedTab,selectId='google-sheet-tab'){const select=$('#'+selectId);if(!select)return;select.innerHTML='<option value="">Loading sheet tabs…</option>';try{const response=await api('/sheets/tabs?spreadsheet='+encodeURIComponent(spreadsheet));select.innerHTML=response.tabs.map(tab=>`<option value="${esc(tab.title)}">${esc(tab.title)}</option>`).join('');if(selectedTab&&response.tabs.some(tab=>tab.title===selectedTab))select.value=selectedTab;else if(response.tabs.length)select.value=response.tabs[0].title}catch(error){select.innerHTML='<option value="">Could not load sheet tabs</option>';select.title=error.message}}
function excelColumn(index){let value=index+1,label='';while(value){value--;label=String.fromCharCode(65+value%26)+label;value=Math.floor(value/26)}return label}
function ensureExcelStyles(){if($('#excel-sheet-style'))return;document.head.insertAdjacentHTML('beforeend','<style id="excel-sheet-style">.excel-frame{border:1px solid #b7b7b7;background:#fff;color:#202124;font:13px Arial,sans-serif;margin:14px 0 4px;box-shadow:0 1px 2px #00000012}.excel-formula{height:36px;display:grid;grid-template-columns:72px 34px minmax(120px,1fr);align-items:center;border-bottom:1px solid #c6c6c6;background:#fff}.excel-name-box{padding:0 10px;border-right:1px solid #d6d6d6;font-size:12px;color:#333}.excel-fx{padding:0 10px;color:#777;font:italic 14px Georgia,serif;border-right:1px solid #e0e0e0}.excel-formula input{border:0!important;border-radius:0!important;box-shadow:none!important;height:34px!important;color:#333!important;font:12px Arial,sans-serif!important}.excel-scroll{max-height:520px;overflow:auto}.excel-grid{border-collapse:separate;border-spacing:0;table-layout:fixed;width:max-content;min-width:100%;font:12px Arial,sans-serif}.excel-grid th,.excel-grid td{border-right:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;padding:0;height:29px;box-sizing:border-box}.excel-grid .excel-corner,.excel-grid .excel-row-number{position:sticky;left:0;z-index:3;width:48px;min-width:48px;max-width:48px;text-align:center;background:#f3f3f3;color:#666;font-weight:400}.excel-grid .excel-corner{top:0}.excel-grid thead .excel-col-letter{position:sticky;top:0;z-index:2;background:#f3f3f3;color:#555;text-align:center;height:25px;font-weight:400;min-width:150px}.excel-grid thead .excel-row-number{top:25px;z-index:4}.excel-grid thead .excel-field-head{position:sticky;top:25px;z-index:2;background:#fff;color:#222;font-weight:600;text-align:left;padding:0 8px;min-width:150px;white-space:nowrap}.excel-grid .excel-cell{display:block;width:100%;min-width:150px;height:28px;margin:0;padding:4px 7px;border:0!important;border-radius:0!important;outline:0;box-shadow:none!important;background:transparent;color:#202124;font:12px Arial,sans-serif;box-sizing:border-box}.excel-grid .excel-cell[readonly]{cursor:default}.excel-grid td:focus-within{outline:2px solid #217346;outline-offset:-2px;position:relative;z-index:1}.excel-grid .excel-action-head,.excel-grid .excel-action-cell{position:sticky;right:0;background:#f8f9fa;z-index:1;min-width:90px;text-align:center;padding:2px 5px}.excel-grid .excel-action-head{top:25px}.excel-grid .excel-empty{padding:12px;color:#777}.excel-status{height:28px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#f3f3f3;color:#666;font-size:11px}.excel-status span{color:#217346}.excel-grid .btn.small{font:11px Arial,sans-serif;padding:5px 8px;white-space:nowrap}@media(max-width:700px){.excel-scroll{max-height:420px}.excel-grid .excel-cell,.excel-grid thead .excel-col-letter,.excel-grid thead .excel-field-head{min-width:125px}}</style>')}
ensureExcelStyles();
document.addEventListener('focusin',event=>{if(!event.target.matches('.excel-cell'))return;const name=$('#excel-cell-name'),formula=$('#excel-formula-value');if(name)name.textContent=event.target.dataset.cellAddress||'';if(formula)formula.value=event.target.value});
document.addEventListener('input',event=>{if(event.target.matches('.excel-cell')){const formula=$('#excel-formula-value');if(formula&&document.activeElement===event.target)formula.value=event.target.value}});
document.addEventListener('input',event=>{if(!event.target.matches('.excel-cell'))return;const row=event.target.closest('tr[data-sheet-row-number]'),host=event.target.closest('#product-sheet-grid,#google-orders-table');if(!row||!host)return;row.classList.add('excel-dirty');const button=$(host.id==='google-orders-table'?'#save-order-sheet-changes':'#save-sheet-changes');if(button){const count=host.querySelectorAll('tr.excel-dirty').length;button.disabled=!count;button.textContent=count?`Save changes (${count})`:'Save changes'}});
function ensureSaveChangesButton(hostId,buttonId,anchorId){const host=$('#'+hostId),anchor=$('#'+anchorId);if(!host||!anchor)return;let button=$('#'+buttonId);if(!button){button=document.createElement('button');button.type='button';button.className='btn';button.id=buttonId;button.textContent='Save changes';button.disabled=true;anchor.parentElement.insertBefore(button,anchor.nextSibling);button.onclick=()=>saveExcelChanges(hostId,buttonId)}const count=host.querySelectorAll('tr.excel-dirty').length;button.disabled=!count;button.textContent=count?`Save changes (${count})`:'Save changes'}
function syncSaveChangesButtons(){for(const[hostId,buttonId,anchorId]of[['product-sheet-grid','save-sheet-changes','toggle-product-sheet-lock'],['google-orders-table','save-order-sheet-changes','toggle-orders-sheet-lock']]){ensureSaveChangesButton(hostId,buttonId,anchorId);const host=$('#'+hostId),button=$('#'+buttonId);if(!host||!button)continue;const count=host.querySelectorAll('tr.excel-dirty').length;button.disabled=!count;button.textContent=count?`Save changes (${count})`:'Save changes'}}
async function saveExcelChanges(hostId,buttonId){const host=$('#'+hostId),button=$('#'+buttonId);if(!host||!button)return;const dirty=[...host.querySelectorAll('tr.excel-dirty')];if(!dirty.length)return;button.disabled=true;let saved=0;try{for(const tr of dirty){if(tr.dataset.sheetSku){const values={};$$('[data-sheet-field]',tr).forEach(input=>values[input.dataset.sheetField]=input.value);await api('/sheets/products/row','PATCH',{sku:tr.dataset.sheetSku,values})}else{const values=[];$$('[data-sheet-cell]',tr).forEach(input=>values[Number(input.dataset.sheetCell)]=input.value);await api('/sheets/products/row','PATCH',{rowNumber:Number(tr.dataset.sheetRowNumber),values})}tr.classList.remove('excel-dirty');saved++}if(hostId==='product-sheet-grid'){await importCurrentSheet();const refresh=$('#reload-product-sheet');if(refresh?.onclick)await refresh.onclick()}else await readGoogleOrders();toast(`${saved} row${saved===1?'':'s'} saved`)}catch(error){toast(`${saved} row${saved===1?'':'s'} saved; ${error.message}`)}finally{const remaining=host.querySelectorAll('tr.excel-dirty').length;button.disabled=!remaining;button.textContent=remaining?`Save changes (${remaining})`:'Save changes'}}
function sheetTable(result){const product=result.kind==='products',headers=product?['sku','name','brand','unit','price','stock','lowStock']:result.headers,rows=result.rows;if(!headers.length)return'<div class="empty">This tab has no columns to display.</div>';const editable=!result.locked;const letters=headers.map((_,index)=>`<th class="excel-col-letter">${excelColumn(index)}</th>`).join(''),head=headers.map(header=>`<th class="excel-field-head">${esc(header)}</th>`).join('');const body=rows.map((item,rowIndex)=>{const rowNumber=product?item.rowNumber||rowIndex+2:item.rowNumber;const cells=product?headers.map((key,index)=>{const value=item[key]??'';return`<td><input class="excel-cell" data-sheet-field="${key}" data-cell-address="${excelColumn(index)}${rowNumber}" value="${esc(value)}" aria-label="${esc(key)}" ${editable?'':'readonly'} ${['price','stock','lowStock'].includes(key)?'type="number" min="0" step="0.01"':''}></td>`}).join(''):item.values.map((value,index)=>`<td><input class="excel-cell" data-sheet-cell="${index}" data-cell-address="${excelColumn(index)}${rowNumber}" value="${esc(value)}" aria-label="${esc(headers[index]||'Column '+(index+1))}" ${editable?'':'readonly'}></td>`).join('');return`<tr data-sheet-row-number="${rowNumber}" ${product?`data-sheet-sku="${esc(item.sku)}"`:''}><th class="excel-row-number">${rowNumber}</th>${cells}</tr>`}).join('');return`<div class="excel-frame"><div class="excel-formula"><span class="excel-name-box" id="excel-cell-name">A1</span><span class="excel-fx">fx</span><input id="excel-formula-value" aria-label="Selected cell value" readonly value="${esc(headers[0]||'')}"></div><div class="excel-scroll"><table class="excel-grid"><thead><tr><th class="excel-corner"></th>${letters}</tr><tr><th class="excel-row-number">1</th>${head}</tr></thead><tbody>${body||`<tr><th class="excel-row-number">2</th><td class="excel-empty" colspan="${headers.length}">This tab has no data rows yet.</td></tr>`}</tbody></table></div><div class="excel-status">${rows.length} rows <span>${editable?'Editing enabled':'Read only · unlock to edit'}</span></div></div>`}
async function importCurrentSheet(){try{const preview=await api('/sheets/preview','POST',{replaceStock:false});const applied=await api('/sheets/apply','POST',{previewId:preview.id});store=await api('/store');if($('#products-table'))productRows();return applied}catch(error){if(/Missing sheet column:|Duplicate sheet column|Duplicate SKU:|Use a header and|Row \d+:|No product rows found/.test(error.message))return null;throw error}}
async function drawProductSheet(){const host=$('#sheets-panel');if(!host)return;host.innerHTML='<section class="panel"><p>Loading Google Sheets settings…</p></section>';try{const state=await api('/sheets');if(!$('#sheets-panel'))return;const error=new URLSearchParams(location.search).get('sheets')==='error'?'<p class="notice">Google connection did not complete. Check OAuth settings, then reconnect.</p>':'';host.innerHTML=`<section class="panel"><div class="panel-heading"><h3>Google Sheets products</h3><span class="badge">${state.connected?'Connected':'Not connected'}</span></div><p>Choose a spreadsheet tab to view its rows. Product tabs sync to Products & stock; all tabs can be edited here.</p>${error}${!state.configured?'<p class="notice">The server administrator must configure Google OAuth and token encryption first. See GOOGLE-SHEETS.md.</p>':''}<p>Last update: ${esc(state.lastSync||'Not synced yet')}</p><div class="actions">${state.connected?'<button class="btn secondary" id="reconnect-google-sheets">Reconnect Google account</button><button class="btn secondary" id="disconnect-google-sheets">Disconnect</button>':'<button class="btn" id="connect-google-sheets" '+(state.configured?'':'disabled')+'>Connect Google account</button>'}<button class="btn secondary" id="download-product-sheet-template">Download sheet template</button></div>${state.connected?`<form id="product-sheet-config"><div class="two-fields"><label>Google spreadsheet<select id="google-sheet-select" name="spreadsheet" required><option value="">Loading your Google Sheets…</option></select></label><label>Sheet tab name<select id="google-sheet-tab" name="tab" required><option value="">Choose a spreadsheet first</option></select></label></div><label><input type="checkbox" name="automatic" value="true" ${state.settings?.automatic?'checked':''}> Update product details and prices automatically about every 5 minutes</label><p class="hint">Automatic product updates preserve existing stock. Other tabs are displayed and edited in the live grid.</p><div class="actions"><button type="button" class="btn secondary" id="refresh-google-sheets">Refresh spreadsheet list</button><button class="btn secondary" type="submit">Save and show sheet</button><button class="btn" type="button" id="reload-product-sheet">Refresh sheet and product list</button><button type="button" class="btn secondary" id="toggle-product-sheet-lock">${state.locked?'🔒 Unlock sheet editing':'🔓 Lock sheet editing'}</button></div></form><p id="product-sheet-message" class="hint">${state.locked?'Sheet is locked. Unlock it to edit cells.':'Sheet is unlocked. Saved changes are written to Google Sheets.'}</p><div id="product-sheet-grid"><p>Select a spreadsheet and tab, then save to show its rows.</p></div>`:''}<p class="notice">Product tabs that sync to inventory need columns <b>sku, name, unit, price, stock</b>. Order tabs remain visible in the live grid.</p></section>`;const connect=async()=>{try{const result=await api('/sheets/connect','POST',{});location.assign(result.url)}catch(error){toast(error.message)}};$('#connect-google-sheets')?.addEventListener('click',connect);$('#reconnect-google-sheets')?.addEventListener('click',connect);$('#disconnect-google-sheets')?.addEventListener('click',async()=>{try{await api('/sheets/disconnect','POST',{});drawProductSheet()}catch(error){toast(error.message)}});$('#download-product-sheet-template')?.addEventListener('click',()=>csv('marketloop-products-template',[{sku:'RICE-1KG',name:'Basmati rice',brand:'Example',unit:'1 kg',price:120,stock:25,lowStock:5}],['sku','name','brand','unit','price','stock','lowStock']));if(state.connected){const sheetSelect=$('#google-sheet-select'),tabSelect=$('#google-sheet-tab');await loadGoogleSpreadsheetOptions('google-sheet-select',state.settings?.spreadsheetId);if(sheetSelect.value)await loadGoogleSheetTabs(sheetSelect.value,state.settings?.tab);sheetSelect.onchange=()=>loadGoogleSheetTabs(sheetSelect.value,'');$('#refresh-google-sheets').onclick=async()=>{await loadGoogleSpreadsheetOptions('google-sheet-select',sheetSelect.value||state.settings?.spreadsheetId);if(sheetSelect.value)await loadGoogleSheetTabs(sheetSelect.value,tabSelect.value)};const configBody=()=>{const form=new FormData($('#product-sheet-config'));return{spreadsheet:form.get('spreadsheet'),tab:form.get('tab'),automatic:form.has('automatic')}};const loadRows=async(sync)=>{const grid=$('#product-sheet-grid');grid.innerHTML='<p>Loading rows from Google Sheets…</p>';try{if(sync){await api('/sheets/config','POST',configBody());await importCurrentSheet()}const result=await api('/sheets/products');grid.innerHTML=`<p>${result.total} rows shown from <b>${esc(tabSelect.value)}</b>.${result.kind==='products'?' Product rows are synced into Products & stock.':''}</p>${result.notice?`<p class="hint">${esc(result.notice)}</p>`:''}${sheetTable(result)}`}catch(error){grid.innerHTML=`<p class="notice">${esc(error.message)}</p>`}};$('#product-sheet-config').onsubmit=async event=>{event.preventDefault();await loadRows(true);toast('Sheet saved and displayed')};$('#reload-product-sheet').onclick=async()=>{await loadRows(true);toast('Sheet refreshed')};$('#toggle-product-sheet-lock').onclick=async()=>{try{const next=await api('/sheets/lock','POST',{locked:!state.locked});state.locked=next.locked;$('#toggle-product-sheet-lock').textContent=state.locked?'🔒 Unlock sheet editing':'🔓 Lock sheet editing';$('#product-sheet-message').textContent=state.locked?'Sheet is locked. Unlock it to edit cells.':'Sheet is unlocked. Saved changes are written to Google Sheets.';await loadRows(false)}catch(error){toast(error.message)}};if(state.settings?.spreadsheetId&&state.settings?.tab)await loadRows(false)}}catch(error){host.innerHTML=`<section class="panel"><h3>Google Sheets products</h3><p>${esc(error.message)}</p></section>`}}
products=function(){productsBeforeSheets();let host=$('#sheets-panel');if(!host){host=document.createElement('div');host.id='sheets-panel';$('#view')?.prepend(host)}drawProductSheet()};
const ordersBeforeAutomaticSheetLoad=orders;
orders=function(){ordersBeforeAutomaticSheetLoad();$('#load-google-orders')?.remove();const form=$('#orders-sheet-form'),spreadsheet=$('#orders-google-sheet-select'),tabInput=form?.elements.tab;if(!form||!spreadsheet||!tabInput)return;const panel=form.closest('.panel');if(panel){const heading=panel.querySelector('h3');if(heading)heading.textContent='Google Sheets live sheet';const description=heading?.nextElementSibling;if(description)description.textContent='Choose any spreadsheet tab to view and edit its rows. The first row provides the column headers.'}const hint=form.nextElementSibling;if(hint)hint.textContent='Any sheet tab can be displayed. Unlock editing to change cells, then save changes back to Google Sheets.';const tabSelect=document.createElement('select');tabSelect.id='orders-google-tab-select';tabSelect.name='tab';tabSelect.required=true;tabInput.replaceWith(tabSelect);const cfg=JSON.parse(localStorage.getItem('marketloop-google-orders')||'{}');const saveDestination=()=>localStorage.setItem('marketloop-google-orders',JSON.stringify({spreadsheet:spreadsheet.value,tab:tabSelect.value}));const loadSelection=async()=>{if(!spreadsheet.value)return;saveDestination();await readGoogleOrders()};spreadsheet.onchange=async()=>{if(!spreadsheet.value)return;await loadGoogleSheetTabs(spreadsheet.value,cfg.tab,'orders-google-tab-select');await loadSelection()};tabSelect.onchange=loadSelection;form.onsubmit=async event=>{event.preventDefault();saveDestination();await loadSelection();toast('Google Sheets destination saved in this browser')};$('#refresh-orders-google-sheets').onclick=async()=>{await loadGoogleSpreadsheetOptions('orders-google-sheet-select',spreadsheet.value||cfg.spreadsheet);if(spreadsheet.value){await loadGoogleSheetTabs(spreadsheet.value,tabSelect.value||cfg.tab,'orders-google-tab-select');await loadSelection()}};loadGoogleSpreadsheetOptions('orders-google-sheet-select',cfg.spreadsheet||'1FU5YQj0L63gvuHCAEaaUfMMosW82bUWiF8bzY0mu4Ec').then(async()=>{if(!spreadsheet.value)return;await loadGoogleSheetTabs(spreadsheet.value,cfg.tab,'orders-google-tab-select');if(view==='orders')await loadSelection()})};
