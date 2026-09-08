/** TerraPath numerical core. Metres throughout; grades are rise / horizontal run. */
export function coneRoute({radius=20,slant=60,offset=10,angle=180}={}) {
  if (![radius,slant,offset,angle].every(Number.isFinite) || radius<=0 || slant<=radius || offset<0 || offset>=slant || angle<0 || angle>360) throw new Error('Use 0 < radius < slant, 0 ≤ B offset < slant, and an angle from 0° to 360°.');
  const h=Math.sqrt(slant*slant-radius*radius), k=radius/slant, b=slant-offset;
  const wrapped=((angle+180)%360)-180, phi=wrapped*Math.PI/180*k;
  const q=[b*Math.cos(phi),b*Math.sin(phi)], v=[q[0]-slant,q[1]];
  const length=Math.hypot(...v), t=length>1e-12?Math.max(0,Math.min(1,-slant*v[0]/length**2)):0;
  const toPoint=u=>{const x=slant+u*v[0], y=u*v[1], rho=Math.hypot(x,y), theta=Math.atan2(y,x)/k;return {x:k*rho*Math.cos(theta),y:k*rho*Math.sin(theta),z:h*(1-rho/slant),s:u*length,u,rho,flatX:x,flatY:y};};
  const ts=[...new Set([...Array.from({length:241},(_,i)=>i/240),t])].sort((a,b)=>a-b), points=ts.map(toPoint);
  const peak=toPoint(t), uphill=t*length, downhill=(1-t)*length;
  // On a cone, the radial component of the unit tangent controls vertical grade.
  const gradeAt=u=>{if(!length)return 0;const p=toPoint(u);const dz=-h/slant*((slant+u*v[0])*v[0]+u*v[1]*v[1])/(p.rho*length);return Math.abs(dz)/Math.sqrt(Math.max(1e-16,1-dz*dz))*100;};
  return {points,length,uphill,downhill,ascent:peak.z-points[0].z,descent:peak.z-points.at(-1).z,maxGrade:Math.max(gradeAt(0),gradeAt(1)),peak,phi,sector:2*Math.PI*k,height:h,radius,slant,offset,angle,b,turning:t>1e-9&&t<1-1e-9};
}
export function makeTerrain(kind='ridge',n=35,size=500,relief=80){
  const heights=Array.from({length:n},(_,j)=>Array.from({length:n},(_,i)=>{const x=i/(n-1),y=j/(n-1);if(kind==='flat')return 0; if(kind==='valley')return relief*(0.65*Math.exp(-((x-.28)**2/.018+(y-.55)**2/.2))+0.8*Math.exp(-((x-.76)**2/.02+(y-.38)**2/.22)));return relief*(Math.exp(-((x-.5)**2/.023+(y-.48)**2/.18))+.22*Math.exp(-((x-.19)**2+(y-.79)**2)/.032));}));
  return validateTerrain({heights,cellSize:size/(n-1)});
}
export function validateTerrain(data){
  const a=data?.heights,cellSize=data?.cellSize;
  if(!Array.isArray(a)||a.length<2||a.length>100||!Array.isArray(a[0])||a[0].length<2||a[0].length>100||a.some(row=>!Array.isArray(row)||row.length!==a[0].length||row.some(v=>!Number.isFinite(v)||Math.abs(v)>1e6))||!Number.isFinite(cellSize)||cellSize<=0||cellSize>1e6)throw new Error('Supply a rectangular 2–100 × 2–100 heights grid of finite numbers, plus a positive cellSize in metres.');
  return {heights:a,cellSize,rows:a.length,cols:a[0].length};
}
class MinHeap {
  constructor(){this.a=[];}
  push(item){let i=this.a.length;this.a.push(item);while(i){let p=(i-1)>>1;if(this.a[p][0]<=item[0])break;this.a[i]=this.a[p];i=p;}this.a[i]=item;}
  pop(){const out=this.a[0],last=this.a.pop();if(this.a.length){let i=0;while(true){let c=i*2+1;if(c>=this.a.length)break;if(c+1<this.a.length&&this.a[c+1][0]<this.a[c][0])c++;if(this.a[c][0]>=last[0])break;this.a[i]=this.a[c];i=c;}this.a[i]=last;}return out;}
}
export function terrainRoute(terrain,start,end,{mode='distance',maxGrade=1000}={}){
  const {heights,rows,cols,cellSize}=validateTerrain(terrain);
  if(!['distance','ascent','gentle'].includes(mode)||!Number.isFinite(maxGrade)||maxGrade<0)throw new Error('Invalid route objective or grade limit.');
  if([start,end].some(p=>!Array.isArray(p)||p.length!==2||!Number.isInteger(p[0])||!Number.isInteger(p[1])||p[0]<0||p[0]>=cols||p[1]<0||p[1]>=rows))throw new Error('Endpoints must be valid grid column / row pairs.');
  const index=([i,j])=>j*cols+i, source=index(start),target=index(end),count=rows*cols;
  const distances=new Float64Array(count).fill(Infinity),prev=new Int32Array(count).fill(-1),heap=new MinHeap();distances[source]=0;heap.push([0,source]);
  // Six neighbours follow the edges of the rendered fixed-diagonal triangle mesh.
  const neighbours=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]];
  while(heap.a.length){const [cost,u]=heap.pop();if(cost!==distances[u])continue;if(u===target)break;const i=u%cols,j=Math.floor(u/cols);
    for(const [di,dj] of neighbours){const x=i+di,y=j+dj;if(x<0||x>=cols||y<0||y>=rows)continue;const v=y*cols+x,run=cellSize*Math.hypot(di,dj),rise=heights[y][x]-heights[j][i],grade=Math.abs(rise)/run*100,len=Math.hypot(run,rise);if(grade>maxGrade+1e-9)continue;
      const next=mode==='gentle'?Math.max(cost,grade):cost+len+(mode==='ascent'?8*Math.max(0,rise):0);
      if(next<distances[v]){distances[v]=next;prev[v]=u;heap.push([next,v]);}
    }
  }
  if(!Number.isFinite(distances[target]))return null;
  const ids=[];for(let u=target;u!==-1;u=prev[u])ids.push(u);ids.reverse();
  const points=ids.map(u=>({x:(u%cols)*cellSize,y:Math.floor(u/cols)*cellSize,z:heights[Math.floor(u/cols)][u%cols]}));
  return {...summarize(points),objective:mode,score:distances[target]};
}
export function summarize(points){let length=0,uphill=0,downhill=0,ascent=0,descent=0,maxGrade=0;points[0].s=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],run=Math.hypot(b.x-a.x,b.y-a.y),rise=b.z-a.z,len=Math.hypot(run,rise);length+=len;b.s=length;if(rise>1e-9){uphill+=len;ascent+=rise;}else if(rise<-1e-9){downhill+=len;descent-=rise;}maxGrade=Math.max(maxGrade,run?Math.abs(rise)/run*100:0);}return {points,length,uphill,downhill,ascent,descent,maxGrade};}
export function estimate(route,{width=4,thickness=.2,rate=1800,waste=5}={}){if(!route||[width,thickness,rate,waste].some(v=>!Number.isFinite(v)||v<0))throw new Error('Estimate inputs must be non-negative.');const area=route.length*width,volume=area*thickness,orderVolume=volume*(1+waste/100);return {area,volume,orderVolume,cost:orderVolume*rate};}
