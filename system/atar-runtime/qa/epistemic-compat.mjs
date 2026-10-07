import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const bundle=fs.readFileSync(new URL('../dist/atar-runtime.umd.js',import.meta.url),'utf8');
// Supply a local D3 7.9.0 fixture to avoid live CDN calls in this test.
const d3=fs.readFileSync(process.env.ATAR_QA_D3_PATH || new URL('../../../.agents/deepseek-v11.4/d3.js',import.meta.url),'utf8');
let count=0;
async function check(name,fn){await fn();count++;console.log('PASS',name);}
function env(data,{failD3=false,stall=false,holdD3=false}={}){
 const dom=new JSDOM('<div id="root" style="height:700px"></div>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://qa.invalid/'});
 const w=dom.window;
 w.Element.prototype.getBoundingClientRect=()=>({width:900,height:700,x:0,y:0,left:0,top:0});
 w.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:900,height:700});
 w.ResizeObserver=class {observe(){} disconnect(){}};
 if(stall){const timeout=w.setTimeout.bind(w);w.setTimeout=(fn,ms)=>timeout(fn,ms===22000?20:ms);}
 const pending=[];
 const append=w.document.head.appendChild.bind(w.document.head);
 w.document.head.appendChild=e=>{
  const out=append(e);
  if(e.tagName==='SCRIPT'){
   if(holdD3 && e.src.includes('d3')) pending.push(e);
   else if(!stall)w.queueMicrotask(()=>e.onerror?.());
  }
  return out;
 };
 if(!failD3 && !stall && !holdD3)w.eval(d3);
 w.eval(bundle);
 const container=w.document.getElementById('root');
 const result=w.AtarRuntime.mount(container,data,{});
 return {w,container,result,close:()=>w.close(),release:()=>{w.eval(d3);pending.forEach(e=>e.onload?.());}};
}
const click=(e,s)=>{const el=e.w.document.querySelector(s);assert.ok(el,s);el.click();};
const graph={type:'kg',nodes:[{id:'a',name:'Hall',type:'Asset',epistemic:'unlabeled'},{id:'b',name:'Care',type:'Cultural Value',epistemic:'inferred',value_label:'Shared care',mappedValueType:'Social'}],edges:[{source:'a',target:'b',label:'expresses'}]};
await check('unlabeled has its own display/count; input untouched; approved aliases copied',async()=>{
 const before=JSON.stringify(graph),e=env(graph);try{
  assert.equal((await e.result.ready).ok,true);
  e.w.document.querySelector('.kg-node').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true}));
  assert.match(e.container.textContent,/No upstream classification/);
  click(e,'.kg-tab[data-tab="analytics"]');
  const text=e.w.document.querySelector('.kg-epistemic-summary').textContent;
  assert.match(text,/〰️ 1/);assert.match(text,/○ 1 Unclassified/);
  assert.equal(JSON.stringify(graph),before);
  const node=[...e.w.document.querySelectorAll('.kg-node')].find(n=>n.__data__.id==='b');
  assert.equal(node.__data__.value_type,'Social');assert.equal(node.__data__.meta['Original value'],'Shared care');
 }finally{e.close();}
});
await check('unknown and omitted collection statuses never enter absent counts',async()=>{
 const e=env({type:'collection',collection:{name:'Test',itemCount:5},sites:['u','e','i','a',null].map((status,i)=>({id:'s'+i,name:'Site '+i,values:status?{Care:status}:{}}))});try{
  assert.equal((await e.result.ready).ok,true);click(e,'.cd-sidebar-tab[data-tab="values"]');
  for(const [s,n] of [['e','1'],['i','1'],['a','1'],['u','2']])assert.equal(e.w.document.querySelector('.cd-c-'+s).textContent,n);
  assert.equal([...e.w.document.querySelectorAll('.cd-val-cell')].filter(x=>x.textContent==='u').length,2);
 }finally{e.close();}
});
await check('undated events separate from numeric years including zero and negative years',async()=>{
 const data={type:'assessment',asset:{name:'Hall'},timeline:[{year:'Unknown period',label:'Unknown',yearStart:null},{year:'BCE',label:'Early',yearStart:-10},{year:'Year zero',label:'Zero',yearStart:0},{year:'String date',label:'String',yearStart:'1900'}],authenticity:{grid:[{aspect:'Use',rating:'Not evaluated'},{aspect:'Fabric',rating:null}]}};
 const before=JSON.stringify(data),e=env(data);try{
  await e.result.ready;click(e,'.db-sidebar-tab[data-tab="timeline"]');
  assert.equal(e.w.document.querySelectorAll('.db-tl-event').length,2);
  assert.equal(e.w.document.querySelectorAll('.db-undated li').length,2);
  assert.match(e.w.document.querySelector('.db-undated').textContent,/Unknown period/);
  click(e,'.db-sidebar-tab[data-tab="integrity"]');
  const badges=[...e.w.document.querySelectorAll('.db-rating')].map(n=>n.textContent);
  assert.ok(badges.includes('○ Not evaluated'));assert.ok(badges.includes('○ Not stated'));
  assert.ok(badges.every(x=>!x.includes('🟡')));assert.equal(JSON.stringify(data),before);
 }finally{e.close();}
});
await check('all-undated chronology still renders its records',async()=>{
 const e=env({type:'assessment',asset:{name:'Hall'},timeline:[{year:'明代',label:'Undated'}]});try{await e.result.ready;click(e,'.db-sidebar-tab[data-tab="timeline"]');assert.equal(e.w.document.querySelectorAll('.db-tl-event').length,0);assert.match(e.w.document.querySelector('.db-undated').textContent,/明代/);}finally{e.close();}
});
await check('invalid IDs/endpoints/tab collisions fail visibly and escape error details',async()=>{
 for(const data of [{...graph,nodes:[graph.nodes[0],graph.nodes[0]]},{...graph,edges:[{source:'a',target:'<img src=x onerror=alert(1)>'}]},{type:'collection',sites:[{id:'x'},{id:'x'}]},{type:'assessment',tabs:[{id:'timeline',type:'prose'}]}]){
  const e=env(data);try{assert.equal(e.result.ok,false);assert.ok(e.w.document.querySelector('.atar-error'));assert.match(e.container.textContent,/显示失败/);assert.equal(e.w.document.querySelectorAll('img').length,0);}finally{e.close();}
 }
});
await check('custom dynamic tabs remain supported in both dashboards',async()=>{
 for(const data of [{type:'assessment',asset:{name:'Hall'}},{type:'collection',collection:{name:'Test'},sites:[]}]){
  data.tabs=[{id:'probe',label:'Probe',type:'custom',data:{html:'<p id="custom-probe">Exact custom content</p>'}}];
  const e=env(data);try{await e.result.ready;click(e,data.type==='assessment'?'.db-sidebar-tab[data-tab="probe"]':'.cd-sidebar-tab[data-tab="probe"]');assert.ok(e.w.document.querySelector('#custom-probe'));}finally{e.close();}
 }
});
await check('ready waits for real asynchronous D3 creation; notice survives root rendering',async()=>{
 const e=env(graph,{holdD3:true});try{
  assert.equal(e.w.document.querySelector('.atar-status').dataset.state,'loading');assert.equal(e.w.document.querySelectorAll('.kg-node').length,0);
  e.release();assert.equal((await e.result.ready).ok,true);assert.equal(e.w.document.querySelectorAll('.kg-node').length,2);
  assert.equal(e.w.document.querySelector('.atar-status').dataset.state,'ready');assert.match(e.w.document.querySelector('.atar-status').textContent,/已就绪/);
 }finally{e.close();}
});
await check('D3 failure/static fallback is error, never ready; timeout also resolves error',async()=>{
 for(const opts of [{failD3:true},{stall:true}]){const e=env(graph,opts);try{assert.equal((await e.result.ready).ok,false);assert.equal(e.w.document.querySelector('.atar-status').dataset.state,'error');assert.match(e.container.textContent,/显示失败/);}finally{e.close();}}
});
await check('Hebrew notices and unlabeled node label',async()=>{
 const data=structuredClone(graph);data.nodes[0].name='בית';
 const e=env(data);try{await e.result.ready;assert.equal(e.w.document.querySelector('.atar-status').textContent,'מוכן');e.w.document.querySelector('.kg-node').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true}));assert.match(e.container.textContent,/ללא סיווג בהערכה המקורית/);}finally{e.close();}
 const bad=env({...data,edges:[{source:'a',target:'missing'}]});try{assert.match(bad.container.textContent,/התצוגה נכשלה/);}finally{bad.close();}
});
console.log(count+' compatibility checks passed (DOM simulation, not browser visual QA).');
