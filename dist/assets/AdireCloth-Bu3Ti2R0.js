import{b as s,j as u,C as w,u as y,V as g,c as d,d as P,e as T,f as z,h as b,N as V}from"./three-BYNSkbCX.js";import{u as M}from"./useInView-DZnOIrUj.js";const C=()=>{const o=document.createElement("canvas");o.width=o.height=512;const e=o.getContext("2d");e.strokeStyle="#fff",e.fillStyle="#fff",e.lineCap="round",e.lineWidth=5,e.globalAlpha=.55,e.lineWidth=3,e.strokeRect(0,0,512,512),e.beginPath(),e.moveTo(256,0),e.lineTo(256,512),e.moveTo(0,256),e.lineTo(512,256),e.stroke(),e.globalAlpha=1,e.lineWidth=5;const n=256/2;[.36,.24].forEach(t=>{e.beginPath(),e.arc(n,n,256*t,0,Math.PI*2),e.stroke()}),e.beginPath(),e.arc(n,n,256*.1,0,Math.PI*2),e.fill();for(let t=0;t<4;t++)for(let i=0;i<4;i++)e.beginPath(),e.arc(256+256*(.2+i*.2),256*(.2+t*.2),7,0,Math.PI*2),e.fill();[.15,.35,.55,.75].forEach(t=>{e.beginPath(),e.moveTo(256*t,512-256*.1),e.lineTo(256*(t+.2),256+256*.1),e.stroke()}),[.3,.5,.7].forEach(t=>{const i=256+256*t,v=256+256*.12,c=256*.76/6;e.beginPath(),e.moveTo(v,i);for(let f=1;f<=6;f++)e.lineTo(v+c*f,i+(f%2?-18:18));e.stroke()});const l=new z(o);return l.wrapS=l.wrapT=b,l.anisotropy=4,l.colorSpace=V,l},j=`
  uniform float uTime;
  uniform float uIntro;
  uniform vec3 uPointer; // xy in plane space, z = strength
  varying vec2 vUv;
  varying vec3 vViewPos;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 p = position;
    float t = uTime;

    // Layered swells, like cloth drying on a line
    float w = sin(p.x * 2.3 + p.y * 0.6 + t * 0.9) * 0.085
            + sin(p.y * 3.1 - p.x * 0.8 - t * 1.1) * 0.055
            + sin((p.x + p.y) * 4.6 + t * 1.6) * 0.022
            + sin(p.x * 7.0 - p.y * 5.0 + t * 2.2) * 0.007;

    // Settle from a big billow into a gentle ripple on load
    w *= mix(2.6, 1.0, uIntro);

    // Push the cloth where the pointer is
    float d = distance(p.xy, uPointer.xy);
    w += exp(-d * d * 2.2) * 0.28 * uPointer.z;
    w += sin(d * 7.0 - t * 5.0) * exp(-d * 1.6) * 0.025 * uPointer.z;

    p.z += w;
    p.x += sin(p.y * 1.3 + t * 0.7) * 0.03;
    vWave = w;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`,k=`
  uniform sampler2D uTex;
  uniform vec2 uRepeat;
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uDeep;
  uniform vec3 uThread;
  varying vec2 vUv;
  varying vec3 vViewPos;
  varying float vWave;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
    vec3 l = normalize(vec3(-0.65, 0.55, 0.5));
    float diff = clamp(dot(n, l) * 1.25 + 0.05, 0.0, 1.0);

    // Mottled resist-dye depth
    float dye = noise(vUv * 6.0) * 0.6 + noise(vUv * 22.0) * 0.4;
    vec3 col = mix(uDeep, uBase, diff * (0.75 + dye * 0.35));

    // Motifs: slightly bled, as if painted with starch
    vec2 tuv = vUv * uRepeat;
    float m = texture2D(uTex, tuv).r;
    float bleed = texture2D(uTex, tuv + vec2(0.004, -0.003)).r;
    float motif = max(m, bleed * 0.45) * (0.72 + dye * 0.28);
    col = mix(col, uThread, motif * (0.35 + diff * 0.5));

    // Soft sheen on the crests
    vec3 v = normalize(-vViewPos);
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 18.0);
    col += spec * 0.22;

    // Vignette
    float vig = smoothstep(1.15, 0.35, length(vUv - 0.5) * 1.6);
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`,I=({pointer:p,onReady:a})=>{const{viewport:o}=y(),e=s.useRef(null),n=s.useRef(new g(0,0,0)),l=s.useMemo(C,[]),t=o.width*1.3,i=o.height*1.3,v=.55,c=s.useMemo(()=>({uTime:{value:0},uIntro:{value:0},uPointer:{value:new g},uTex:{value:l},uRepeat:{value:new P(1,1)},uBase:{value:new d("#22538f")},uDeep:{value:new d("#0b2140")},uThread:{value:new d("#e2ecf8")}}),[l]);return s.useEffect(()=>{c.uRepeat.value.set(t/v,i/v)},[t,i,c]),s.useEffect(()=>(a==null||a(),()=>l.dispose()),[a,l]),T((f,x)=>{const h=c;h.uTime.value+=x,h.uIntro.value=Math.min(1,h.uIntro.value+x*.45);const m=p.current,r=n.current;r.x+=(m.x*o.width/2-r.x)*.08,r.y+=(m.y*o.height/2-r.y)*.08,r.z+=(m.active-r.z)*.05,h.uPointer.value.copy(r)}),u.jsxs("mesh",{rotation:[-.12,.06,0],children:[u.jsx("planeGeometry",{args:[t,i,160,160]}),u.jsx("shaderMaterial",{ref:e,uniforms:c,vertexShader:j,fragmentShader:k})]})},W=({pointer:p,onReady:a})=>{const o=s.useRef(null),e=M(o);return u.jsx("div",{ref:o,className:"absolute inset-0",children:u.jsx(w,{frameloop:e?"always":"never",dpr:[1,1.75],camera:{position:[0,0,3],fov:40},gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},children:u.jsx(I,{pointer:p,onReady:a})})})};export{W as default};
