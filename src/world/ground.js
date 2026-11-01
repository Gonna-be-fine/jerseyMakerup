import * as THREE from 'three';

const GROUND_VERT = `
#include <common>
#include <fog_pars_vertex>
uniform float time;
varying vec2 vUv;
varying vec3 vPos;
varying float vFade;
void main(){
    vUv = uv;
    vec3 transformed = vec3(position);
    vec4 mvPosition = vec4(transformed, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    vec3 transformedNormal = vec3(normal);
    transformedNormal = normalMatrix * transformedNormal;
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vPos = worldPosition.xyz;
    vFade = dot(normalize(transformedNormal), normalize(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
}
`;

const GROUND_FRAG = `
precision highp float;
#include <common>
#include <dithering_pars_fragment>
#include <fog_pars_fragment>
uniform vec4 res;
uniform float opacity;
uniform vec3 color;
uniform float groundType;
uniform float gridScale;
uniform float time;
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vPos;
varying float vFade;
void main() {
    vec2 sp = gl_FragCoord.xy / res.xy;
    float shadow = texture2D(map, (vUv - 0.5) * 1.8 + 0.5).a;
    float dist = length(vUv.xy - 0.5);
    
    float grid = 0.0;
    
    if (groundType < 0.5) {
        float s = 1.0;
        float eps = 0.02;
        vec2 guv = vPos.xz * s * gridScale;
        vec2 g = vec2(0.0);
        guv.x += 0.5 * step(0.5, fract(guv.y));
        guv = abs(fract(guv) - 0.5);
        g.x = smoothstep(0.25 - eps, 0.25 + eps, guv.x);
        guv -= 0.25;
        guv.y += 0.5 * step(0.5, fract(guv.x));
        guv = abs(fract(guv) - 0.5);
        g.y = smoothstep(0.25 - eps, 0.25 + eps, guv.y);
        grid = smoothstep(0.9, 0.4, g.y * g.x) * 0.3;
    } else if (groundType < 1.5) {
        vec2 r = vec2(1.0, 1.7320508);
        vec2 h = r * 0.5;
        vec2 p = vPos.xz * 1.5 * gridScale;
        vec2 a = fract(p / r) * r - h;
        vec2 b = fract((p - h) / r) * r - h;
        vec2 hexUv = dot(a, a) < dot(b, b) ? a : b;
        vec2 coordCell = dot(a, a) < dot(b, b) ? floor(p / r) : floor((p - h) / r);
        float hexDist = max(abs(hexUv.x), dot(abs(hexUv), vec2(0.5, 0.866025)));
        float hexEdge = abs(hexDist - 0.42);
        float hexInside = smoothstep(0.40, 0.38, hexDist);
        float checkValue = step(0.5, mod(coordCell.x + coordCell.y, 2.0));
        float baseOutline = smoothstep(0.035, 0.0, hexEdge) * 0.38;
        float baseFill = hexInside * 0.28 * checkValue;
        grid = baseOutline + baseFill;
    } else if (groundType < 2.5) {
        float scale = 1.6 * gridScale;
        vec2 p = vPos.xz * scale;
        float uCoord = p.x - p.y / 1.7320508;
        float vCoord = p.y * 2.0 / 1.7320508;
        float iu = floor(uCoord);
        float iv = floor(vCoord);
        float fu = fract(uCoord);
        float fv = fract(vCoord);
        float triangleSide = step(fu + fv, 1.0);
        float triId = fract(sin(dot(vec3(iu, iv, triangleSide), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        float d1 = abs(fract(vPos.z * scale + 0.5) - 0.5);
        float d2 = abs(fract((vPos.z * 0.5 + vPos.x * 0.866025) * scale + 0.5) - 0.5);
        float d3 = abs(fract((vPos.z * 0.5 - vPos.x * 0.866025) * scale + 0.5) - 0.5);
        float minLineDist = min(min(d1, d2), d3);
        float faceMask = smoothstep(0.02, 0.05, minLineDist);
        float fillShade = 0.0;
        if (triId < 0.25) {
            fillShade = 0.22;
        } else if (triId < 0.50) {
            fillShade = 0.06;
        } else if (triId < 0.72) {
            fillShade = -0.15;
        }
        float line1 = smoothstep(0.025, 0.0, d1);
        float line2 = smoothstep(0.025, 0.0, d2);
        float line3 = smoothstep(0.025, 0.0, d3);
        float lines = max(max(line1, line2), line3);
        grid = lines * 0.38 + faceMask * fillShade * 0.26;
    } else if (groundType < 3.5) {
        float ringDist = length(vPos.xz) * gridScale;
        float rings = smoothstep(0.025, 0.0, abs(fract(ringDist * 1.2 + 0.5) - 0.5));
        float angle = atan(vPos.z, vPos.x);
        float rays = smoothstep(0.015, 0.0, abs(fract(angle * 12.0 / 6.2831853 + 0.5) - 0.5));
        grid = max(rings * 0.35, rays * 0.18) * smoothstep(5.0, 0.0, ringDist);
    }

    float falloff = smoothstep(6.0, 3.0, length(vPos.xz));
    vec3 bgColor = color * (groundType > 3.5 ? 0.88 : 0.92);
    vec3 col = bgColor;
    vec3 shadowTint = bgColor * bgColor * bgColor * bgColor;
    col = mix(col, col * shadowTint * 0.8, grid * 0.32);
    col = mix(col, col * shadowTint * 0.2 - 0.05, shadow);
    col = mix(col, col * shadowTint * 0.8, smoothstep(0.4, 0.0, dist) * 0.3);
    falloff *= opacity;
    gl_FragColor = vec4(col, falloff);
    #include <colorspace_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
}
`;

const makeNullTexture = () => {
  const texture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 0]), 1, 1, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
};

export const setGroundColor = (target, color) => {
  if (!color) {
    target.setRGB(0.117647, 0.117647, 0.117647);
    return target;
  }

  if (typeof color === 'string') {
    const hex = color.trim();
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
    if (match) {
      const value = match[1].length === 3
        ? match[1].split('').map((v) => v + v).join('')
        : match[1];
      target.setRGB(
        parseInt(value.slice(0, 2), 16) / 255,
        parseInt(value.slice(2, 4), 16) / 255,
        parseInt(value.slice(4, 6), 16) / 255
      );
      return target;
    }
  }

  if (typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
    target.setRGB(color.r, color.g, color.b);
    return target;
  }

  target.set(color);
  return target;
};

export class Ground {
  constructor(world, options = {}) {
    this.world = world;
    this.options = {
      y: -1,
      scale: 6.5,
      opacity: 1,
      groundType: 0,
      gridScale: 2.6,
      followTarget: true,
      ...options,
    };
    this.elapsedTime = 0;
    this.targetColor = setGroundColor(new THREE.Color(), world.options.backgroundColor || '#1e1e1e');
    this.currentColor = this.targetColor.clone();
    this.init();
  }

  init() {
    this.group = new THREE.Group();
    this.group.name = 'ground';
    this.nullTexture = makeNullTexture();
    this.material = new THREE.ShaderMaterial({
      vertexShader: GROUND_VERT,
      fragmentShader: GROUND_FRAG,
      uniforms: {
        res: { value: new THREE.Vector4(1, 1, 1, 1) },
        time: { value: 0 },
        opacity: { value: this.options.opacity },
        color: { value: this.currentColor.clone() },
        groundType: { value: this.options.groundType },
        gridScale: { value: this.options.gridScale },
        map: { value: this.nullTexture },
      },
      transparent: true,
      depthWrite: false,
    });

    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = 'groundMesh';
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.scale.set(-this.options.scale, this.options.scale, 1);
    this.mesh.position.y = this.options.y;
    this.mesh.renderOrder = -50;
    this.group.add(this.mesh);
    this.world.scene.add(this.group);
    this.resize();
  }

  setTargetColor(color) {
    setGroundColor(this.targetColor, color || '#1e1e1e');
  }

  setGroundType(type) {
    if (this.material) {
      this.material.uniforms.groundType.value = type;
    }
  }

  setGridScale(scale) {
    if (this.material) {
      this.material.uniforms.gridScale.value = Math.max(0.1, scale);
    }
  }

  resize() {
    if (!this.material || !this.world.renderer) return;
    const pixelRatio = this.world.renderer.getPixelRatio();
    this.material.uniforms.res.value.set(
      Math.max(1, this.world.width),
      Math.max(1, this.world.height),
      this.world.width / Math.max(1, this.world.height),
      1 / Math.max(1, pixelRatio)
    );
  }

  update(delta = 0) {
    if (!this.material) return;
    this.elapsedTime += delta;
    this.currentColor.lerp(this.targetColor, 0.1);
    this.material.uniforms.color.value.copy(this.currentColor);
    this.material.uniforms.time.value = this.elapsedTime;

    if (this.options.followTarget && this.world.controls) {
      const target = this.world.controls.target;
      this.mesh.position.x = target.x;
      this.mesh.position.z = target.z;
    }
  }

  dispose() {
    if (this.group && this.world.scene) {
      this.world.scene.remove(this.group);
    }
    this.geometry?.dispose();
    this.material?.dispose();
    this.nullTexture?.dispose();
    this.group = null;
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.nullTexture = null;
  }
}
