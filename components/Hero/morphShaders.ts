/**
 * Shaders for the hero's morphing point field. Each point travels from aFrom to
 * aTo as uProgress runs 0 → 1, starting a little later the further it sits along
 * the rising-arrow direction (aRand.w), with a soft swirl at mid-flight.
 */

export const morphVertex = /* glsl */ `
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
`;

export const morphFragment = /* glsl */ `
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
`;
