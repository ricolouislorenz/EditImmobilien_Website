import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require=createRequire(import.meta.url);
const { JSDOM }=require(process.env.TURNSTILE_DOM_TEST_MODULE || 'jsdom');
const { build }=require('esbuild'); const React=require('react'); const { act }=React;
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
async function fixture(t){
  const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/admin'});
  globalThis.window=dom.window; globalThis.document=dom.window.document;
  const previousConfirm=globalThis.confirm; globalThis.confirm=()=>true;
  const { createRoot }=require('react-dom/client'); const { MemoryRouter }=require('react-router-dom');
  const property={id:'00000000-0000-4000-8000-000000000011',title:'Testhaus',reference:'EI-001',status:'active',location:'25488 Holm',price:'100 EUR',updated_at:'2026-10-22T12:00:00Z'};
  const f={properties:[property],trash:[],calls:[],operation:async()=>({data:null,error:null})};
  globalThis.__trashTest={fetchAllProperties:async()=>f.properties,
    supabase:{from:(table)=>{assert.equal(table,'property_trash');return{select:()=>({order:async()=>({data:f.trash,error:null})})};},
      rpc:async(name,args)=>{f.calls.push({name,args});return f.operation(name,args);}}};
  const compiled=await build({entryPoints:['src/admin/PropertiesPage.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',
    external:['react','react-dom','react-dom/*','react-router-dom'],plugins:[{name:'trash-fixture',setup(builder){
      builder.onResolve({filter:/^@\/lib\/supabase$/},()=>({path:'supabase',namespace:'fixture'}));
      builder.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export const supabase=globalThis.__trashTest.supabase; export const fetchAllProperties=globalThis.__trashTest.fetchAllProperties;'}));
    }}]});
  const module={exports:{}}; new Function('require','module','exports',compiled.outputFiles[0].text)(require,module,module.exports);
  const root=createRoot(document.getElementById('root'));
  await act(async()=>root.render(React.createElement(MemoryRouter,null,React.createElement(module.exports.PropertiesPage))));
  t.after(async()=>{await act(async()=>root.unmount());dom.window.close();delete globalThis.window;delete globalThis.document;delete globalThis.__trashTest;if(previousConfirm===undefined)delete globalThis.confirm;else globalThis.confirm=previousConfirm;});
  return Object.assign(f,{property,remove:async()=>{await act(async()=>document.querySelector('[aria-label="Testhaus löschen"]').click());}});
}
test('Unbestätigte Löschung lässt die Immobilie sichtbar und zeigt Prüfungshinweis',async(t)=>{
  const f=await fixture(t); await f.remove();
  assert.match(document.querySelector('[role="alert"]').textContent,/nicht bestätigt/);
  assert.ok(document.querySelector('[aria-label="Testhaus löschen"]'));
  assert.equal(f.calls[0].name,'delete_property');assert.equal(f.calls[0].args.p_expected_updated_at,f.property.updated_at);
});
test('Bestätigtes Verschieben und Wiederherstellen aktualisieren Übersicht und Papierkorb',async(t)=>{
  const f=await fixture(t);
  f.operation=async(name)=>{
    if(name==='delete_property'){f.properties=[];f.trash=[{property_id:f.property.id,snapshot:f.property,expires_at:'2099-01-01T00:00:00Z'}];}
    else{assert.equal(name,'restore_property');f.properties=[f.property];f.trash=[];}
    return{data:{id:f.property.id},error:null};
  };
  await f.remove();assert.equal(document.querySelector('[aria-label="Testhaus löschen"]'),null);
  await act(async()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Papierkorb (1)')).click());
  await act(async()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Wiederherstellen')).click());
  assert.ok(document.querySelector('[aria-label="Testhaus löschen"]'));assert.match(document.body.textContent,/Papierkorb \(0\)/);
});
test('Offene Löschanfrage verhindert mehrfaches Absenden',async(t)=>{
  const f=await fixture(t);let finish;f.operation=()=>new Promise(resolve=>{finish=resolve;});
  await f.remove(); const buttons=[...document.querySelectorAll('[aria-label="Testhaus löschen"]')];
  assert.ok(buttons.every(b=>b.disabled));await f.remove();assert.equal(f.calls.length,1);
  await act(async()=>finish({data:null,error:{code:'42501'}}));
});
