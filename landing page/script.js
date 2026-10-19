let fil=0;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const rp=n=>'Rp'+n.toLocaleString('id-ID');
const MENU=[
{id:1,c:'Kopi',e:'☕',n:'Kopi Tubruk',d:'Kopi hitam pekat diseduh tradisional.',p:15000},
{id:2,c:'Kopi',e:'🥛',n:'Kopi Susu',d:'Kopi hangat dengan susu manis lembut.',p:18000},
{id:3,c:'Kopi',e:'🍨',n:'Es Kopi Float',d:'Kopi dingin dengan es krim di atasnya.',p:25000},
{id:4,c:'Roti',e:'🍞',n:'Roti Srikaya',d:'Roti panggang dengan selai srikaya resep keluarga.',p:16000},
{id:5,c:'Roti',e:'🥪',n:'Roti Smoked Beef',d:'Roti isi smoked beef gurih.',p:28000},
{id:6,c:'Makanan',e:'🍚',n:'Nasi Goreng Kampung',d:'Nasi goreng sederhana, rasa rumahan.',p:32000},
{id:7,c:'Makanan',e:'🍲',n:'Rawon',d:'Sup daging berkuah hitam kluwek.',p:38000},
{id:8,c:'Makanan',e:'🥣',n:'Lontong Cap Go Meh',d:'Lontong dengan kuah dan lauk pelengkap.',p:35000}];
const cats=['Semua',...new Set(MENU.map(m=>m.c))];
let cart=JSON.parse(localStorage.getItem('wkp_cart')||'{}'), cat='Semua';

/* nav */
const nav=$('#nav');
addEventListener('scroll',()=>{nav.classList.toggle('solid',scrollY>60);
 const y=scrollY+120;$$('section[id]').forEach(s=>{if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight)
 $$('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+s.id))});
 const m=$('.moon');if(m)m.style.translate=`0 ${scrollY*.25}px`});
$('#burger').onclick=()=>$('#menuNav').classList.toggle('open');
$$('nav a').forEach(a=>a.onclick=()=>$('#menuNav').classList.remove('open'));

/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');
 e.target.querySelectorAll('[data-n]').forEach(b=>{const t=+b.dataset.n;let i=0;const k=setInterval(()=>{i+=Math.ceil(t/40);if(i>=t){i=t;clearInterval(k)}b.textContent=i},30)});
 io.unobserve(e.target)}),{threshold:.15});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(el.closest('.hero')?i*.15:0)+'s';io.observe(el)});

/* menu */
$('#tabs').innerHTML=cats.map(c=>`<button class="${c==='Semua'?'on':''}">${c}</button>`).join('');
$('#tabs').onclick=e=>{if(e.target.tagName!=='BUTTON')return;cat=e.target.textContent;$$('#tabs button').forEach(b=>b.classList.toggle('on',b===e.target));renderMenu()};
function renderMenu(){$('#menuGrid').innerHTML=MENU.filter(m=>cat==='Semua'||m.c===cat).map((m,i)=>
`<div class="item" style="animation-delay:${i*.07}s"><div class="e">${m.e}</div><h3>${m.n}</h3><p>${m.d}</p><div class="pr"><b>${rp(m.p)}</b><button data-id="${m.id}" aria-label="Tambah ${m.n}">+</button></div></div>`).join('')}
$('#menuGrid').onclick=e=>{const id=e.target.dataset.id;if(!id)return;cart[id]=(cart[id]||0)+1;saveCart();toast('Ditambahkan: '+MENU.find(m=>m.id==id).n);
 $('#cartBtn').classList.remove('bump');void $('#cartBtn').offsetWidth;$('#cartBtn').classList.add('bump')};

/* cart */
const total=()=>Object.entries(cart).reduce((s,[id,q])=>s+MENU.find(m=>m.id==id).p*q,0);
function saveCart(){localStorage.setItem('wkp_cart',JSON.stringify(cart));renderCart()}
function renderCart(){const ids=Object.keys(cart);$('#cartCount').textContent=ids.reduce((s,i)=>s+cart[i],0);
 $('#cartItems').innerHTML=ids.length?ids.map(id=>{const m=MENU.find(x=>x.id==id);return `<div class="ci"><div>${m.e} <b>${m.n}</b><br><small>${rp(m.p)}</small></div><div class="q"><button data-a="-" data-id="${id}">−</button><span>${cart[id]}</span><button data-a="+" data-id="${id}">+</button></div></div>`}).join(''):'<p class="empty">Belum ada pesanan ☕</p>';
 $('#subT').textContent=rp(total())}
$('#cartItems').onclick=e=>{const{a,id}=e.target.dataset;if(!a)return;cart[id]+=a==='+'?1:-1;if(cart[id]<=0)delete cart[id];saveCart()};
const drawer=(o)=>{$('#drawer').classList.toggle('open',o);$('#overlay').classList.toggle('on',o)};
$('#cartBtn').onclick=()=>drawer(true);$('#closeCart').onclick=$('#overlay').onclick=()=>drawer(false);

/* receipt */
$('#checkout').onclick=()=>{
 if(!total())return toast('Pesanan masih kosong');
 const name=$('#cName').value.trim(),table=$('#cTable').value.trim();
 if(!name||!table)return toast('Isi nama dan nomor meja dulu');
 const sub=total(),tax=Math.round(sub*.1),now=new Date(),no='WKP-'+now.toISOString().slice(2,10).replace(/-/g,'')+'-'+String(Math.floor(Math.random()*9000)+1000);
 const lines=Object.entries(cart).map(([id,q])=>{const m=MENU.find(x=>x.id==id);return `<div>${m.n}</div><div class="l"><span>${q} x ${rp(m.p)}</span><span>${rp(m.p*q)}</span></div>`}).join('');
 $('#receipt').innerHTML=`<h3>WARUNG KOPI PURNAMA</h3><div class="c">Jl. Alkateri No. 22, Braga, Bandung<br>Sejak 1930</div><hr>
 <div class="l"><span>No</span><span>${no}</span></div><div class="l"><span>Tanggal</span><span>${now.toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'})}</span></div>
 <div class="l"><span>Pelanggan</span><span>${esc(name)}</span></div><div class="l"><span>Meja</span><span>${esc(table)}</span></div><div class="l"><span>Jenis</span><span>${$('#cType').value}</span></div>${$('#cNote').value.trim()?`<div>Catatan: ${esc($('#cNote').value.trim())}</div>`:''}${lines}<hr>
 <div class="l"><span>Subtotal</span><span>${rp(sub)}</span></div><div class="l"><span>Pajak 10%</span><span>${rp(tax)}</span></div>
 <div class="l t"><span>TOTAL</span><span>${rp(sub+tax)}</span></div><div class="l"><span>Bayar</span><span>${$('#cPay').value}</span></div><hr>
 <div class="c">Terima kasih sudah mampir!<br>Struk demo, bukan bukti pembayaran resmi.</div>
 <div class="acts"><button onclick="window.print()">🖨 Cetak</button><button onclick="closeReceipt()">Selesai</button></div>`;
 cart={};saveCart();drawer(false);$('#modal').classList.add('open');
};
window.closeReceipt=()=>{$('#modal').classList.remove('open');toast('Pesananmu sedang disiapkan ☕')};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* reviews */
const SEED=[{n:'Contoh: Rina',r:5,t:'Roti srikayanya manis pas, kopinya mantap. Suasana tempo dulunya dapat banget.',d:'2 minggu lalu',s:1},
{n:'Contoh: Dimas',r:4,t:'Cocok buat sarapan sebelum jalan-jalan di Braga. Kadang antre di pagi hari.',d:'1 bulan lalu',s:1},
{n:'Contoh: Maya',r:5,t:'Kopi tubruk dan lontongnya enak, tempatnya penuh nostalgia.',d:'2 bulan lalu',s:1}];
let reviews=[...JSON.parse(localStorage.getItem('wkp_rev')||'[]'),...SEED],pick=0;
const star=n=>'★'.repeat(n)+'☆'.repeat(5-n);
function renderReviews(){const n=reviews.length,avg=reviews.reduce((s,r)=>s+r.r,0)/n;
 $('#avgNum').textContent=avg.toFixed(1);$('#avgStars').textContent=star(Math.round(avg));$('#avgCount').textContent=n+' ulasan';
 $('#bars').innerHTML=[5,4,3,2,1].map(k=>{const c=reviews.filter(r=>r.r===k).length;return `<div class="bar"><span>${k}★</span><i><s data-w="${c/n*100}"></s></i><span>${c}</span></div>`}).join('');
 setTimeout(()=>$$('.bar s').forEach(s=>s.style.width=s.dataset.w+'%'),50);
 $('#reviewList').innerHTML=reviews.filter(r=>!fil||(fil===3?r.r<=3:r.r===fil)).map(r=>`<div class="rv"><header><span>${esc(r.n)}${r.s?'<span class="tag">contoh</span>':''}</span><span class="stars">${star(r.r)}</span></header><small>${r.d}</small><p>${esc(r.t)}</p></div>`).join('')}
$('#starPick').innerHTML=[1,2,3,4,5].map(i=>`<span data-v="${i}">★</span>`).join('');
$('#starPick').onclick=e=>{if(!e.target.dataset.v)return;pick=+e.target.dataset.v;$$('#starPick span').forEach(s=>s.classList.toggle('on',s.dataset.v<=pick))};
$('#reviewForm').onsubmit=e=>{e.preventDefault();if(!pick)return toast('Pilih bintang dulu ⭐');
 const mine=JSON.parse(localStorage.getItem('wkp_rev')||'[]');mine.unshift({n:$('#rName').value.trim(),r:pick,t:$('#rText').value.trim(),d:'baru saja'});
 localStorage.setItem('wkp_rev',JSON.stringify(mine));reviews=[...mine,...SEED];renderReviews();e.target.reset();pick=0;$$('#starPick span').forEach(s=>s.classList.remove('on'));toast('Terima kasih atas ulasanmu!')};

let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
renderMenu();renderCart();renderReviews();

/* ===== V2 ===== */
addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('off'),1700));
addEventListener('scroll',()=>{const h=document.documentElement;$('#prog').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';$('#toTop').classList.toggle('show',scrollY>600)},{passive:true});
$('#toTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});
if(matchMedia('(hover:hover)').matches){const g=$('#glow');addEventListener('mousemove',e=>{g.style.opacity=1;g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'})}
/* status buka/tutup (WIB) */
(()=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
const m=+p[0].value*60+ +p[2].value,open=m>=390&&m<1320,s=$('#status');s.textContent=open?'Buka sekarang · 06.30–22.00 WIB':'Sedang tutup · buka 06.30 WIB';s.classList.toggle('closed',!open)})();
/* langit: bintang + biji kopi melayang */
(()=>{const c=$('#sky'),x=c.getContext('2d');let W,H,P=[];const rs=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;P=Array.from({length:Math.min(90,W/12)},(_,i)=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,s:Math.random()*.4+.1,t:Math.random()*6,b:i%9===0}))};rs();addEventListener('resize',rs);
(function f(){x.clearRect(0,0,W,H);P.forEach(p=>{p.t+=.03;p.y+=p.b?p.s*.8:0;if(p.y>H)p.y=-10;
if(p.b){x.save();x.translate(p.x,p.y);x.rotate(p.t/3);x.fillStyle='#8a5a3a';x.beginPath();x.ellipse(0,0,7,4.5,0,0,6.3);x.fill();x.strokeStyle='#3a2216';x.beginPath();x.moveTo(-6,0);x.quadraticCurveTo(0,-3,6,0);x.stroke();x.restore()}
else{x.globalAlpha=.4+Math.sin(p.t)*.4;x.fillStyle='#fff7dc';x.beginPath();x.arc(p.x,p.y,p.r,0,6.3);x.fill();x.globalAlpha=1}});requestAnimationFrame(f)})()})();
/* tilt kartu menu + terbang ke keranjang */
$('#menuGrid').addEventListener('mousemove',e=>{const c=e.target.closest('.item');if(!c)return;const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
c.style.transform=`perspective(700px) rotateY(${(px-.5)*12}deg) rotateX(${(.5-py)*12}deg) translateY(-6px)`;c.style.setProperty('--mx',px*100+'%');c.style.setProperty('--my',py*100+'%')});
$('#menuGrid').addEventListener('mouseout',e=>{const c=e.target.closest('.item');if(c)c.style.transform=''});
$('#menuGrid').addEventListener('click',e=>{const id=e.target.dataset.id;if(!id)return;const a=e.target.getBoundingClientRect(),b=$('#cartBtn').getBoundingClientRect(),el=document.createElement('div');
el.className='fly';el.textContent=MENU.find(m=>m.id==id).e;el.style.left=a.left+'px';el.style.top=a.top+'px';document.body.append(el);
el.animate([{transform:'scale(1)'},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(.3) rotate(360deg)`,opacity:.3}],{duration:800,easing:'cubic-bezier(.5,-.3,.8,.5)'}).onfinish=()=>el.remove()});
MENU.forEach(m=>{if([1,4,3].includes(m.id))m.b=1});
const _rm=renderMenu;renderMenu=function(){_rm();$$('#menuGrid .item').forEach((el,i)=>{const list=MENU.filter(m=>cat==='Semua'||m.c===cat);if(list[i].b)el.insertAdjacentHTML('afterbegin','<span class="badge">Favorit</span>')})};renderMenu();
/* filter ulasan */
$('#chips').onclick=e=>{if(!e.target.dataset.f)return;fil=+e.target.dataset.f;$$('#chips button').forEach(b=>b.classList.toggle('on',b===e.target));renderReviews()};