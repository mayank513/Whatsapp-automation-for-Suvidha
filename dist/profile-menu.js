// Both store and profile icons open the same accessible account menu.
const profileMenu=document.querySelector('#profile-menu');
const profileToggles=[document.querySelector('#store-profile-toggle'),document.querySelector('#initials')].filter(Boolean);
let activeProfileToggle=null;
function closeProfileMenu(returnFocus=false){profileMenu.hidden=true;profileToggles.forEach(b=>b.setAttribute('aria-expanded','false'));if(returnFocus)activeProfileToggle?.focus();activeProfileToggle=null}
function openProfileMenu(button){if(!me)return;if(!profileMenu.hidden&&activeProfileToggle===button){closeProfileMenu(true);return}activeProfileToggle=button;profileToggles.forEach(b=>b.setAttribute('aria-expanded',String(b===button)));document.querySelector('#profile-menu-heading').textContent=me.role==='admin'?'Administrator account':store?.settings.name||'Store account';profileMenu.hidden=false;const rect=button.getBoundingClientRect(),width=Math.min(240,window.innerWidth-24);profileMenu.style.width=width+'px';profileMenu.style.left=Math.max(12,Math.min(rect.left,window.innerWidth-width-12))+'px';profileMenu.style.top=Math.max(12,Math.min(rect.bottom+10,window.innerHeight-profileMenu.offsetHeight-12))+'px';document.querySelector('#profile-logout').focus()}
profileToggles.forEach(button=>{button.addEventListener('click',()=>openProfileMenu(button));button.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openProfileMenu(button)}})});
document.querySelector('#profile-logout')?.addEventListener('click',signOut);
document.querySelector('#header-logout')?.addEventListener('click',signOut);
document.addEventListener('click',e=>{if(!profileMenu.hidden&&!profileMenu.contains(e.target)&&!profileToggles.some(b=>b.contains(e.target)))closeProfileMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!profileMenu.hidden){e.preventDefault();closeProfileMenu(true)}if(e.key==='Tab'&&!profileMenu.hidden)closeProfileMenu()});
window.addEventListener('resize',()=>closeProfileMenu());window.addEventListener('scroll',()=>closeProfileMenu(),true);
