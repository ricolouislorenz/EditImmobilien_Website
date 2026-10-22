import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleanupPropertyImages } from '../scripts/cleanup-property-images.mjs';
const path = '00000000-0000-4000-8000-000000000011/unused.jpg';
function fixture() {
  const calls = []; const logs = [];
  const f = { result: { data: { paths: [path], expired_entries: 1, dry_run: true }, error: null }, removed: { data: [{ name: path }], error: null } };
  f.client = {
    rpc: async (name, args) => { calls.push({ name, args }); return f.result; },
    storage: { from: (bucket) => ({ remove: async (paths) => { calls.push({ bucket, paths }); return f.removed; } }) },
  };
  return Object.assign(f, { calls, logs, log: (message) => logs.push(message) });
}
test('Prüfmodus ist Standard und löscht niemals Dateien',async()=>{
  const f=fixture(); await cleanupPropertyImages(f.client,{log:f.log});
  assert.equal(f.calls.length,1); assert.equal(f.calls[0].args.p_dry_run,true);
  assert.match(f.logs[0],/Nur Vorschau/);
});
test('Echte Bereinigung benutzt nur bestätigte Kandidaten und ausschließlich die Storage API',async()=>{
  const f=fixture(); f.result.data.dry_run=false;
  await cleanupPropertyImages(f.client,{apply:true,log:f.log});
  assert.deepEqual(f.calls[1],{bucket:'property-images',paths:[path]});
  assert.match(f.logs.at(-1),/1 Bildlöschungen bestätigt/);
});
for(const result of [
  {data:null,error:{code:'42501'}},
  {data:{paths:['logo.jpg'],dry_run:false},error:null},
  {data:{paths:[path],dry_run:true},error:null},
]) test('Fehlende oder unpassende Bestätigung stoppt vor jeder Dateilöschung',async()=>{
  const f=fixture(); f.result=result;
  await assert.rejects(cleanupPropertyImages(f.client,{apply:true,log:f.log}),/Keine Storage-Löschung/);
  assert.equal(f.calls.length,1);
});
test('Fehlende Löschbestätigungen und API-Fehler werden als Fehler gemeldet',async()=>{
  for(const removed of [{data:[],error:null},{data:null,error:{message:'offline'}}]){
    const f=fixture(); f.result.data.dry_run=false; f.removed=removed;
    await assert.rejects(cleanupPropertyImages(f.client,{apply:true,log:f.log}),/nicht vollständig bestätigt/);
    assert.doesNotMatch(f.logs.join(' '),/Bildlöschungen bestätigt/);
  }
});
