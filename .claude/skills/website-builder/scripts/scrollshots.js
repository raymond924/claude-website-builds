const path=require('path');const {execSync}=require('child_process');
const pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'));
(async()=>{const [url,out,w=1440,h=900]=process.argv.slice(2);
const b=await pw.chromium.launch();const pg=await b.newPage({viewport:{width:+w,height:+h}});
await pg.goto(url,{waitUntil:'networkidle',timeout:60000}).catch(()=>{});await pg.waitForTimeout(2500);
const total=await pg.evaluate(()=>document.documentElement.scrollHeight);let i=0;
for(let y=0;y<total;y+= +h*0.9){await pg.mouse.wheel(0,0);await pg.evaluate(y=>window.scrollTo(0,y),y);await pg.waitForTimeout(1600);
await pg.screenshot({path:`${out}-${String(i++).padStart(2,'0')}.png`});}
console.log('frames',i,'height',total);await b.close();})();
