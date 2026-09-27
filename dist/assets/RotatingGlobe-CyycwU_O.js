import{b as i,j as n,C as j,e as h,V as g,B as y,i as S,c as p,k as C,T as F,Q as z,D as b,l as P}from"./three-BYNSkbCX.js";import{u as _}from"./useInView-DZnOIrUj.js";const x=(t,e,r=1)=>{const l=(90-t)*(Math.PI/180),c=(e+180)*(Math.PI/180);return new g(-(r*Math.sin(l)*Math.cos(c)),r*Math.cos(l),r*Math.sin(l)*Math.sin(c))},V=`
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    gl_PointSize = uSize * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,T=`
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float a = smoothstep(-0.35, 0.55, vFacing);
    gl_FragColor = vec4(uColor, 0.12 + a * 0.78);
    #include <colorspace_fragment>
  }
`,R=({color:t,size:e})=>{const r=i.useMemo(()=>{const o=new Float32Array(7800),f=Math.PI*(3-Math.sqrt(5));for(let m=0;m<2600;m++){const a=1-m/2599*2,s=Math.sqrt(1-a*a),d=f*m;o.set([Math.cos(d)*s,a,Math.sin(d)*s],m*3)}const u=new y;return u.setAttribute("position",new S(o,3)),u},[]),l=i.useMemo(()=>({uColor:{value:new p(t)},uSize:{value:e}}),[]);return i.useEffect(()=>{l.uColor.value.set(t),l.uSize.value=e},[t,e,l]),n.jsx("points",{geometry:r,children:n.jsx("shaderMaterial",{uniforms:l,vertexShader:V,fragmentShader:T,transparent:!0,depthWrite:!1})})},E=`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,I=`
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    // Rim-only halo: bright where the shell is edge-on, clear in the middle
    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float i = pow(edge, 4.0) * uStrength;
    gl_FragColor = vec4(uColor, i);
    #include <colorspace_fragment>
  }
`,B=({color:t,strength:e})=>{const r=i.useMemo(()=>({uColor:{value:new p(t)},uStrength:{value:e}}),[]);return i.useEffect(()=>{r.uColor.value.set(t),r.uStrength.value=e},[t,e,r]),n.jsxs("mesh",{scale:1.12,children:[n.jsx("sphereGeometry",{args:[1,64,64]}),n.jsx("shaderMaterial",{uniforms:r,vertexShader:E,fragmentShader:I,side:P,transparent:!0,depthWrite:!1})]})},k=`
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOffset;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    float p = mod(uTime * 0.42 + uOffset, 2.2);
    float grow = clamp(p / 0.9, 0.0, 1.0);
    float fade = 1.0 - clamp((p - 1.5) / 0.5, 0.0, 1.0);
    float along = vUv.x;
    if (along > grow) discard;
    float head = smoothstep(grow - 0.18, grow, along);
    float a = (0.28 + head * 0.72) * fade * smoothstep(-0.45, 0.15, vFacing);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`,G=`
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,N=({from:t,to:e,color:r,offset:l})=>{const c=i.useMemo(()=>{const u=1+t.distanceTo(e)*.38,m=t.clone().lerp(e,.25).normalize().multiplyScalar(u),a=t.clone().lerp(e,.75).normalize().multiplyScalar(u),s=new C(t,m,a,e);return new F(s,96,.0065,8,!1)},[t,e]),o=i.useMemo(()=>({uColor:{value:new p(r)},uTime:{value:0},uOffset:{value:l}}),[]);return i.useEffect(()=>void o.uColor.value.set(r),[r,o]),h((f,u)=>{o.uTime.value+=u}),n.jsx("mesh",{geometry:c,children:n.jsx("shaderMaterial",{uniforms:o,vertexShader:G,fragmentShader:k,transparent:!0,depthWrite:!1})})},M=({position:t,color:e,active:r,home:l})=>{const c=i.useRef(null),o=i.useRef(null),f=i.useMemo(()=>new g,[]),u=i.useMemo(()=>new z().setFromUnitVectors(new g(0,0,1),t.clone().normalize()),[t]);return h(({clock:m,camera:a})=>{if(!c.current||!o.current)return;o.current.getWorldPosition(f),o.current.visible=f.normalize().dot(a.position.clone().normalize())>.08;const s=m.getElapsedTime()*.9%1,d=r||l?s:0;c.current.scale.setScalar(1+d*2.2),c.current.material.opacity=r||l?.9*(1-s):0}),n.jsxs("group",{ref:o,position:t,quaternion:u,children:[n.jsxs("mesh",{children:[n.jsx("circleGeometry",{args:[l?.028:.02,24]}),n.jsx("meshBasicMaterial",{color:e})]}),n.jsxs("mesh",{ref:c,children:[n.jsx("ringGeometry",{args:[.028,.036,32]}),n.jsx("meshBasicMaterial",{color:e,transparent:!0,side:b,depthWrite:!1})]})]})},v={lat:6.5244,lon:3.3792},U=({palette:t,locations:e,activeIndex:r,pointer:l})=>{const c=i.useRef(null),o=i.useRef(null),f=i.useMemo(()=>x(v.lat,v.lon,1.005),[]),u=i.useMemo(()=>e.map(a=>x(a.lat,a.lon,1.005)),[e]),m=i.useMemo(()=>-((v.lon+90)*Math.PI)/180,[]);return h((a,s)=>{if(c.current&&(c.current.rotation.y+=s*.12),o.current&&l.current){const d=.28+l.current.y*.25,w=l.current.x*.35;o.current.rotation.x+=(d-o.current.rotation.x)*.05,o.current.rotation.z+=(-w*.3-o.current.rotation.z)*.05}}),n.jsxs("group",{ref:o,rotation:[.28,0,0],children:[n.jsxs("group",{ref:c,rotation:[0,m,0],children:[n.jsx(R,{color:t.dot,size:3.4}),u.map((a,s)=>a.distanceTo(f)>.2?n.jsx(N,{from:f,to:a,color:t.arc,offset:s*.37},e[s].name):null),u.map((a,s)=>n.jsx(M,{position:a,color:t.marker,active:s===r},e[s].name)),n.jsx(M,{position:f,color:t.marker,active:!1,home:!0})]}),n.jsx(B,{color:t.glow,strength:t.glowStrength})]})},q=({isDarkMode:t,locations:e,onActiveLocationChange:r})=>{const l=i.useRef(null),c=_(l),[o,f]=i.useState(0),u=i.useRef({x:0,y:0});i.useEffect(()=>{if(!e.length||!c)return;const a=setInterval(()=>f(s=>(s+1)%e.length),1600);return()=>clearInterval(a)},[e.length,c]),i.useEffect(()=>{e[o]&&(r==null||r(e[o].name))},[o,e,r]);const m=t?{dot:"#8f9dff",glow:"#5566e0",glowStrength:.9,arc:"#f0b93a",marker:"#f0b93a"}:{dot:"#2e3d99",glow:"#7d8ef0",glowStrength:.55,arc:"#d99a17",marker:"#d99a17"};return n.jsx("div",{ref:l,className:"w-full h-full",onPointerMove:a=>{const s=a.currentTarget.getBoundingClientRect();u.current={x:(a.clientX-s.left)/s.width*2-1,y:(a.clientY-s.top)/s.height*2-1}},onPointerLeave:()=>u.current={x:0,y:0},children:n.jsx(j,{frameloop:c?"always":"never",dpr:[1,1.75],camera:{position:[0,0,3.6],fov:38},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},children:n.jsx(U,{palette:m,locations:e,activeIndex:o,pointer:u})})})};export{q as default};
