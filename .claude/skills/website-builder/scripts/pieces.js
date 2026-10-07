// node pieces.js <file> <outdir> : screenshots every [data-piece] element at 1440 and 390 widths
const path=require('path');const {execSync}=require('child_process');
const pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'));
(async()=>{const [file,out]=process.argv.slice(2);require('fs').mkdirSync(out,{recursive:true});
const b=await pw.chromium.launch();
for(const [tag,w,h] of [['desk',1440,900],['mob',390,844]]){
 const pg=await b.newPage({viewport:{width:w,height:h}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await pg.goto('file://'+path.resolve(file));await pg.waitForTimeout(1200);
 const H=await pg.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=h/2){await pg.evaluate(y=>scrollTo(0,y),y);await pg.waitForTimeout(150);}await pg.evaluate(()=>scrollTo(0,0));await pg.waitForTimeout(800);
 const sw=await pg.evaluate(()=>document.documentElement.scrollWidth);
 const ids=[...new Set(await pg.$$eval('[data-piece]',els=>els.map(e=>e.dataset.piece)))];
 for(const id of ids){const box=await pg.$$eval(`[data-piece="${id}"]`,els=>{let t=1e9,b=0;for(const e of els){const r=e.getBoundingClientRect();t=Math.min(t,r.top+scrollY);b=Math.max(b,r.bottom+scrollY);}return {t,b};});
  await pg.evaluate(y=>scrollTo(0,y),box.t);await pg.waitForTimeout(500);
  await pg.screenshot({path:`${out}/piece${id}-${tag}.png`,fullPage:true,clip:{x:0,y:box.t,width:w,height:box.b-box.t}});}
 console.log(tag,'scrollWidth',sw,'pieces',ids.join(','),'errors',errs.length?errs.join(' | '):'none');}
await b.close();})();
