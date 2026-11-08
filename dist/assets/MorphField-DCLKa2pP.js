import{j as z,C as Y,b as w,h as G,B as K,c as F,d as D,u as W,A as X,M as B}from"./three-b-znLjno.js";import{M as J,a as Q,B as L}from"./index-CPXGpkgX.js";const Z=["logo","ai","tools","product","chat","globe"],U=s=>{let e=s>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}},y=s=>{const e=Math.max(s(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*s())},$=s=>{const e=[],t=/([MLHV])\s*([-\d.]+)(?:[\s,]+([-\d.]+))?/g;let r=0,a=0,o;for(;o=t.exec(s);){const[,n,h,c]=o;n==="H"?r=+h:n==="V"?a=+h:(r=+h,a=+(c??0)),e.push([r,a])}return e},tt=(s,e,t,r)=>{const a=s.map(h=>2*h.r*Math.hypot(h.bx-h.ax,h.by-h.ay)+Math.PI*h.r*h.r),o=a.reduce((h,c)=>h+c,0),n=[];for(;n.length<e;){let h=t()*o,c=s[0];for(let d=0;d<s.length;d++)if(h-=a[d],h<=0){c=s[d];break}const u=Math.hypot(c.bx-c.ax,c.by-c.ay)||1e-6,p=(c.bx-c.ax)/u,f=(c.by-c.ay)/u,i=-c.r+t()*(u+2*c.r),l=(t()*2-1)*c.r,m=Math.min(u,Math.max(0,i));Math.hypot(i-m,l)>c.r||n.push([c.ax+p*i-f*l,c.ay+f*i+p*l,r()])}return n},T=(s,e,t,r,a,o)=>Array.from({length:r},()=>{const n=a()*Math.PI*2,h=t*Math.sqrt(a());return[s+Math.cos(n)*h,e+Math.sin(n)*h,o()]}),E=(s,e,t,r=.008,a=!1)=>{const o=[],n=a?s.length:s.length-1;for(let u=0;u<n;u++){const p=s[u],f=s[(u+1)%s.length];o.push([p,f,Math.hypot(f[0]-p[0],f[1]-p[1],f[2]-p[2])])}const h=o.reduce((u,p)=>u+p[2],0),c=[];for(let u=0;u<e;u++){let p=(u+t())/e*h,f=o[o.length-1];for(const d of o){if(p<=d[2]){f=d;break}p-=d[2]}const i=f[2]?Math.min(1,p/f[2]):0,[l,m]=f;c.push([l[0]+(m[0]-l[0])*i+y(t)*r,l[1]+(m[1]-l[1])*i+y(t)*r,l[2]+(m[2]-l[2])*i+y(t)*r])}return c},j=(s,e,t,r,a,o=0)=>{const n=[],h=[[t-a,r-a,0],[s+a,r-a,Math.PI/2],[s+a,e+a,Math.PI],[t-a,e+a,3*Math.PI/2]];for(const[c,u,p]of h)for(let f=0;f<=6;f++){const i=p+f/6*(Math.PI/2);n.push([c+Math.cos(i)*a,u+Math.sin(i)*a,o])}return n},k=(s,e,t,r,a,o,n=0)=>Array.from({length:a},()=>[s+o()*(t-s),e+o()*(r-e),n+y(o)*.01]),C=(s,e)=>{const t=Math.cos(e),r=Math.sin(e);return s.map(([a,o,n])=>[t*a+r*n,o,-r*a+t*n])},_=(s,e)=>{const t=Math.cos(e),r=Math.sin(e);return s.map(([a,o,n])=>[a,t*o-r*n,r*o+t*n])},q=(s,e,t)=>{const r=s.slice();for(let o=r.length-1;o>0;o--){const n=Math.floor(t()*(o+1));[r[o],r[n]]=[r[n],r[o]]}if(r.length>=e)return r.slice(0,e);const a=r.slice();for(;a.length<e;){const o=r[Math.floor(t()*r.length)]??[0,0,0];a.push([o[0]+y(t)*.01,o[1]+y(t)*.01,o[2]+y(t)*.01])}return a},et=(s,e,t)=>{const r=.05555555555555555,a=d=>(d-25.5)*r,o=d=>-(d-24)*r,n=()=>(t()-.5)*.16,h={stem:5.5,arrow:4.8,head:4.8,leg:4.8},c=[];for(const[d,M]of Object.entries(J)){const x=$(M);for(let v=0;v<x.length-1;v++)c.push({ax:a(x[v][0]),ay:o(x[v][1]),bx:a(x[v+1][0]),by:o(x[v+1][1]),r:h[d]/2*r})}const[u,p,f]=Q,i=Math.round(s*.035),l=tt(c,s-e-i,t,n),m=[...T(a(u.cx),o(u.cy),u.r*r,Math.round(i*.42),t,n),...T(a(p.cx),o(p.cy),p.r*r,i-Math.round(i*.42),t,n)];return{accent:T(a(f.cx),o(f.cy),f.r*r,e,t,n),rest:[...l,...m]}},ot=(s,e,t)=>{const r=[[-.75,0,.75],[-1.05,-.35,.35,1.05],[-.45,.45]],a=[-1.05,0,1.05],o=r.map((l,m)=>l.map(d=>[a[m],d,(t()-.5)*.6])),n=[];for(let l=0;l<o.length-1;l++)for(const m of o[l])for(const d of o[l+1])n.push([m,d]);const h=o.flat(),c=Math.round((s-e)*.42),u=Array.from({length:c},(l,m)=>{const d=h[m%h.length];return[d[0]+y(t)*.055,d[1]+y(t)*.055,d[2]+y(t)*.055]}),p=Math.floor((s-e-c)/n.length);for(const[l,m]of n)u.push(...E([l,m],p,t,.012));const f=[o[0][0],o[1][2],o[2][1]];return{accent:[...E(f,Math.round(e*.6),t,.01),...f.flatMap(l=>Array.from({length:Math.round(e*.4/3)},()=>[l[0]+y(t)*.04,l[1]+y(t)*.04,l[2]+y(t)*.04]))],rest:u}},st=(s,e,t)=>{const r=[[-1.25,.6,1.25,.82],[-1.25,-.82,-.8,.5],[-.7,.12,-.02,.5],[.08,.12,.6,.5],[.7,.12,1.25,.5],[-.7,-.82,1.25,.02]],a=Math.round((s-e)*.8),o=s-e-a,n=r.map(([i,l,m,d])=>2*(m-i+(d-l))),h=n.reduce((i,l)=>i+l,0),c=r.map(([i,l,m,d])=>(m-i)*(d-l)),u=c.reduce((i,l)=>i+l,0),p=[];return r.forEach(([i,l,m,d],M)=>{p.push(...E(j(i,l,m,d,.06),Math.round(a*n[M]/h),t,.006,!0)),p.push(...k(i+.04,l+.04,m-.04,d-.04,Math.round(o*c[M]/u),t))}),{accent:E([[-.58,-.7,.02],[-.2,-.45,.02],[.15,-.55,.02],[.55,-.2,.02],[.85,-.3,.02],[1.12,-.08,.02]],e,t,.012),rest:C(p,-.32).map(i=>i)}},at=(s,e,t)=>{const r=[-.62,0,.62],a=Math.floor((s-e)/r.length);let o=[];r.forEach((c,u)=>{const p=Math.round(a*.72),f=[...E(j(-.95,-.95,.95,.95,.18),p,t,.006,!0),...k(-.85,-.85,.85,.85,a-p,t)];o.push(...f.map(([i,l])=>[i,c+(u===2?.08:0),l]))}),o=_(C(o,Math.PI/4),.5);const n=_(C([[0,.92,0]],Math.PI/4),.5)[0];return{accent:Array.from({length:e},()=>[n[0]+y(t)*.07,n[1]+y(t)*.07,n[2]+y(t)*.07]),rest:o}},rt=(s,e,t)=>{const r=[...j(-1.15,-.5,1.15,.8,.32).filter(([f,i])=>!(i<-.45&&f>-.75&&f<-.25))],a=Math.round((s-e)*.78),o=[[-.25,-.5,0],[-.8,-1,0],[-.72,-.5,0]],n=Math.round(a*.14),h=[...E(r,a-n,t,.007,!0),...E(o,n,t,.007),...k(-1.05,-.4,1.05,.7,s-e-a,t)],c=()=>(t()-.5)*.06,u=Math.floor(e/3),p=[...T(-.45,.15,.12,u,t,c),...T(0,.15,.12,u,t,c),...T(.45,.15,.12,e-2*u,t,c)];return{accent:C(p,.28),rest:C(h,.28)}},O=[[9.082,8.6753],[55.3781,-3.436],[37.0902,-95.7129],[23.4241,53.8478],[20.5937,78.9629],[-31.9535,115.857]],nt=(s,e,t)=>{const r=(90-s)*(Math.PI/180),a=(e+180)*(Math.PI/180);return[-(t*Math.sin(r)*Math.cos(a)),t*Math.cos(r),t*Math.sin(r)*Math.sin(a)]},ct=(s,e,t)=>{const r=s-e,a=Math.PI*(3-Math.sqrt(5)),o=1.08;let n=Array.from({length:r},(p,f)=>{const i=1-f/(r-1)*2,l=Math.sqrt(1-i*i),m=a*f;return[Math.cos(m)*l*o,i*o,Math.sin(m)*l*o]});const h=Math.floor(e/O.length);let c=O.flatMap(([p,f],i)=>Array.from({length:i===O.length-1?e-h*(O.length-1):h},()=>nt(p+y(t)*2.2,f+y(t)*2.2,o*1.01)));const u=-1.75;return n=_(C(n,u),.32),c=_(C(c,u),.32),{accent:c,rest:n}},lt={logo:et,ai:ot,tools:st,product:at,chat:rt,globe:ct},H=s=>s.sort((e,t)=>e[0]+e[1]-(t[0]+t[1])),ut=(s,e,t=7)=>{const r={};for(const a of Z){const o=U(t+a.length*101+a.charCodeAt(0)),{accent:n,rest:h}=lt[a](s,e,o),c=[...H(q(n,e,o)),...H(q(h,s-e,o))],u=new Float32Array(s*3);c.forEach((p,f)=>u.set(p,f*3)),r[a]=u}return r},it=`
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSpread;
  uniform float uScatter;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;   // xyz: direction in [-1, 1]; w: rank along the arrow, 0..1
  attribute float aAccent;

  varying float vAccent;
  varying float vAlpha;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) * 0.5;
  }

  void main() {
    float t = easeInOutCubic(clamp((uProgress - aRand.w * uSpread) / (1.0 - uSpread), 0.0, 1.0));
    vec3 p = mix(aFrom, aTo, t);

    // Mid-flight swirl about Y and a gentle scatter, both zero at rest
    float mid = sin(3.14159265 * t);
    float a = mid * (0.45 + 0.45 * aRand.x);
    float c = cos(a);
    float s = sin(a);
    p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z);
    p += aRand.xyz * mid * 0.28;

    // Idle breathing so the field never sits perfectly still
    p += aRand.xyz * 0.014 * sin(uTime * 0.9 + aRand.w * 6.2831);

    // Scrolling away disperses the field
    p += aRand.xyz * uScatter * 1.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float jitter = 0.7 + 0.6 * fract(aRand.w * 7.31 + aRand.y);
    gl_PointSize = uSize * uPixelRatio * jitter * (1.0 + aAccent * 0.45) / -mv.z;
    gl_Position = projectionMatrix * mv;

    vAccent = aAccent;
    vAlpha = (1.0 - 0.35 * mid) * (1.0 - uScatter);
  }
`,ht=`
  uniform vec3 uPaper;
  uniform vec3 uOchre;
  uniform float uIntensity;

  varying float vAccent;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.18, 0.0, d);
    float halo = pow(smoothstep(0.5, 0.0, d), 2.4) * 0.45;
    vec3 col = mix(uPaper, uOchre, vAccent);
    gl_FragColor = vec4(col, (core + halo) * vAlpha * uIntensity * (1.0 + vAccent * 0.6));
    #include <colorspace_fragment>
  }
`,ft=1.7,pt=2.2,N=.42,dt=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,mt=({shape:s,count:e,pointer:t,scatter:r,onReady:a})=>{const o=Math.round(e*.03),n=w.useMemo(()=>ut(e,o),[e,o]),h=G(M=>M.gl),c=w.useRef(null),u=w.useRef(0),p=w.useRef(pt),f=w.useRef(0),i=w.useRef(!1),l=w.useRef(s),m=w.useMemo(()=>{const M=U(42),x=new Float32Array(e*3),v=new Float32Array(e*4),g=new Float32Array(e);for(let A=0;A<e;A++){const R=M()*2-1,P=M()*Math.PI*2,I=2.4+M()*2.2,S=Math.sqrt(1-R*R);x.set([Math.cos(P)*S*I,R*I*.7,Math.sin(P)*S*I-1],A*3);const V=A<o?A/o:(A-o)/(e-o);v.set([M()*2-1,M()*2-1,M()*2-1,.7*V+.3*M()],A*4),g[A]=A<o?1:0}const b=new K;return b.setAttribute("position",new F(n[s].slice(),3)),b.setAttribute("aFrom",new F(x,3)),b.setAttribute("aTo",new F(n[s].slice(),3)),b.setAttribute("aRand",new F(v,4)),b.setAttribute("aAccent",new F(g,1)),b},[e,o,n]);w.useEffect(()=>()=>m.dispose(),[m]);const d=w.useMemo(()=>({uProgress:{value:0},uTime:{value:0},uSize:{value:26},uPixelRatio:{value:h.getPixelRatio()},uSpread:{value:N},uScatter:{value:0},uIntensity:{value:.72},uPaper:{value:new D(L.paper)},uOchre:{value:new D(L.ochreOnDark)}}),[h]);return w.useEffect(()=>{if(s===l.current)return;l.current=s;const M=m.getAttribute("aFrom"),x=m.getAttribute("aTo"),v=m.getAttribute("aRand"),g=M.array,b=x.array,A=v.array,R=u.current;for(let P=0;P<e;P++){const I=dt(Math.min(1,Math.max(0,(R-A[P*4+3]*N)/(1-N))));for(let S=0;S<3;S++)g[P*3+S]+=(b[P*3+S]-g[P*3+S])*I}b.set(n[s]),M.needsUpdate=!0,x.needsUpdate=!0,u.current=0,p.current=ft},[s,n,m,e]),W((M,x)=>{var b,A;const v=Math.min(x,.03333333333333333);f.current+=v,u.current=Math.min(1,u.current+v/p.current),d.uProgress.value=u.current,d.uTime.value=f.current,d.uScatter.value=Math.min(1,Math.max(0,r.current??0));const g=c.current;if(g){const R=((b=t.current)==null?void 0:b.x)??0,P=((A=t.current)==null?void 0:A.y)??0,I=Math.sin(f.current*.22)*.32;g.rotation.y=B.damp(g.rotation.y,I+R*.14,3,v),g.rotation.x=B.damp(g.rotation.x,-P*.1,3,v)}i.current||(i.current=!0,a==null||a())}),z.jsx("group",{ref:c,children:z.jsx("points",{geometry:m,frustumCulled:!1,children:z.jsx("shaderMaterial",{uniforms:d,vertexShader:it,fragmentShader:ht,transparent:!0,depthWrite:!1,blending:X})})})},vt=({active:s,...e})=>{const t=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches;return z.jsx(Y,{className:"morph-canvas",frameloop:s?"always":"never",dpr:t?[1,1.5]:[1,1.75],camera:{position:[0,0,5.4],fov:38},gl:{alpha:!0,antialias:!1,powerPreference:"high-performance"},children:z.jsx(mt,{...e})})};export{vt as default};
