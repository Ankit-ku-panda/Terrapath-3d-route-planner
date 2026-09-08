// Produce a standards-compliant uncompressed ZIP using Node built-ins only.
// Public source excludes local deployment identity, Git metadata and itself.
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,relative} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const exclude=new Set(['.git','.openai','node_modules','.env','.DS_Store','terrapath-source.zip']);
async function walk(dir){let files=[];for(const e of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){if(exclude.has(e.name)||e.name.endsWith('.log'))continue;const p=join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else if(e.isFile())files.push(p);}return files;}
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(b){let c=0xffffffff;for(const n of b)c=table[(c^n)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
const local=[],central=[];let offset=0,count=0;
for(const path of await walk(root)){const name=Buffer.from('terrapath-3d-route-planner/'+relative(root,path).replaceAll('\\','/')),data=await readFile(path),sum=crc(data),h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(33,12);h.writeUInt32LE(sum,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);local.push(h,name,data);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(33,14);c.writeUInt32LE(sum,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+data.length;count++;}
const cd=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);const out=join(root,'dist','terrapath-source.zip');await writeFile(out,Buffer.concat([...local,cd,end]));console.log(`Packaged ${count} source files into ${out}`);
