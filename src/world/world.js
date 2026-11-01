import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DecalManager } from './decalManager';
import EventDispatch from '../utils/EventDispatch';
import { Lights, Lights1, ClothNormalOptions } from './config';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import FabricEditor from './editor/FabricEditor.js';
import { publicPath } from '../utils/publicPath.js';
import { initNormalDevTool } from '../utils/normalDevTool.js';
import { Ground, setGroundColor } from './ground.js';
import {
	computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVH
} from 'three-mesh-bvh';


THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);

const getRendererPixelRatio = () =>
  Math.min(window.devicePixelRatio || 1, isTouchDevice() ? 2 : 2);

const getEventPoint = (event) => event.touches?.[0] || event.changedTouches?.[0] || event;

const ENABLE_NORMAL_DEV_TOOL = import.meta.env.DEV && import.meta.env.VITE_ENABLE_NORMAL_TOOL !== 'false';
const DEFAULT_NORMAL_OPTIONS = {
  url: '/texture/normal/2.png',
  scale: 1.2,
  repeat: 15,
  roughness: 0.5,
  metalness: 0,
  debugNormalMode: 0,
};

const getDefaultNormalOptions = (options = {}) => ({
  ...DEFAULT_NORMAL_OPTIONS,
  ...(ClothNormalOptions[options.sportType] || {}),
  ...(options.normalOptions || {}),
});

const resolveTextureUrl = (url) => {
  if (!url || /^(blob:|data:|https?:\/\/)/.test(url)) return url;
  return publicPath(url);
};

export class World extends EventDispatch {
  constructor(dom, options) {
    super();
    this.glDom = dom;
    this.width = this.glDom.clientWidth || window.innerWidth;
    this.height = this.glDom.clientHeight || window.innerHeight;
    this.options = options;
    this.enableNormalDevTool = options.enableNormalDevTool ?? ENABLE_NORMAL_DEV_TOOL;
    this.defaultNormalOptions = getDefaultNormalOptions(options);
    this.init();
    this.importModel();
    // this.initGui();
  }

  /**
   * @description: 初始化场景
   */
  init() {
    // renderer
    this.isMobile = isTouchDevice();
    this.isRenderingEnabled = true;
    const pixelRatio = getRendererPixelRatio();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: !this.isMobile,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(this.width, this.height);
    if (!this.glDom) {
      document.body.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.position = 'absolute';
    } else {
      this.glDom.appendChild(this.renderer.domElement);
    }
    this.targetBgColor = setGroundColor(new THREE.Color(), this.options.backgroundColor || '#1e1e1e');
    this.currentBgColor = this.targetBgColor.clone();
    this.renderer.setClearColor(this.currentBgColor);
    // 颜色矫正
    // this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.01,
      1000
    );
    // this.camera.position.z = 120;
    if (this.options.cameraPosition) {
      this.camera.position.copy(this.options.cameraPosition);
    } else {
      this.camera.position.set(
        -0.009666748088079795,
        0.1459023549040876,
        0.6137803763666974
      );
    }
    this.camera.target = new THREE.Vector3();

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.01;
    this.controls.maxDistance = 100;

    this.ground = new Ground(this, this.options.ground);

    // lights
    this.addLights(this.options.lights);

    // resize handler
    this.onWindowResize = () => {
      this.width = this.glDom.clientWidth;
      this.height = this.glDom.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setPixelRatio(getRendererPixelRatio());
      this.renderer.setSize(this.width, this.height);
      this.ground?.resize();
      // this.decalManager.resize();
    };
    if (!this.glDom) {
      window.addEventListener('resize', this.onWindowResize, false);
    } else {
      const resizeObserver = new ResizeObserver(this.onWindowResize);
      resizeObserver.observe(this.glDom);
      this.resizeObserver = resizeObserver;
    }

    // this.scene.add(new THREE.AxesHelper(1));

    // init DecalManager
    // this.decalManager = new DecalManager(this);

    // animation
    this.clock = new THREE.Clock();
    this.animation();
  }

  /**
   * @description: 添加灯光
   */
  addLights(light) {
    // const lights = new THREE.Group();
    // lights.name = 'lights';
    // lights.add(new THREE.AmbientLight(0xffffff, 1));
    // this.scene.add(lights);
    const objectLoader = new THREE.ObjectLoader();
    const o = objectLoader.parse(light || Lights);
    this.scene.add(o);
    // // 添加lightHelper
    // o.traverse(v => {
    //   if(v.isLight && v.type === "DirectionalLight"){
    //     const lh = new THREE.DirectionalLightHelper(v);
    //     lh.name = v.name + 'hp';
    //     o.add(lh);
    //     setTimeout(() => {
    //       this.addDirectionLightGui(v);
    //     }, 2000)
    //   }
    // })
  }

  /**
   * @description: 添加平行光GUI调试
   * @param {*} light THREE.DirectionalLight
   */
  addDirectionLightGui(light) {
    const param = {
      x: 0,
      y: 0,
      distance: 5,
      intensity: light.intensity,
      visible: 0,
    };
    this.gui.add(param, 'x', 0, 360).onChange((e) => {
      const result = this.getLightPositionAndDisitance({
        rotateX: param.x,
        rotateY: param.y,
        distance: param.distance,
        target: light.target.position,
      });
      light.position.copy(result.pos);

      this.scene.traverse((l) => {
        if (l.isMesh && l.name === 'hp') {
          l.updateMatrixWorld();
          l.update();
        }
      });
    });
    this.gui.add(param, 'y', 0, 180).onChange((e) => {
      const result = this.getLightPositionAndDisitance({
        rotateX: param.x,
        rotateY: param.y,
        distance: param.distance,
        target: light.target.position,
      });
      light.position.copy(result.pos);
      this.scene.traverse((l) => {
        if (l.isMesh && l.name === 'hp') {
          l.updateMatrixWorld();
          l.update();
        }
      });
    });
    this.gui.add(param, 'intensity', 0, 10).onChange(() => {
      light.intensity = param.intensity;
    });
    this.gui.add(param, 'visible', 0, 10).onChange(() => {
      light.visible = param.visible > 5;
      this.scene.getObjectByName(light.name + 'hp').visible = light.visible;
    });
  }

  /**
   * @description: 根据rotateY, rotateX, distance, target获取平行光灯光位置
   * @param {*} lightData {rotateY, rotateX, distance, target}
   * @param {*} realTarget light.target
   */
  getLightPositionAndDisitance(lightData, realTarget) {
    const { rotateY, rotateX, distance, target } = lightData;
    const rRad = THREE.MathUtils.degToRad(rotateY);
    const aRad = THREE.MathUtils.degToRad(rotateX - 90);
    const v = new THREE.Vector3(1, 0, 0);
    const tempQua = new THREE.Quaternion();
    const targetQua = new THREE.Quaternion();
    tempQua.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rRad);
    targetQua.multiply(tempQua);
    tempQua.setFromAxisAngle(new THREE.Vector3(0, 1, 0), aRad);
    targetQua.multiply(tempQua);
    v.applyQuaternion(targetQua);
    v.normalize();
    const tempTarget = realTarget || target;
    const targetThreePosition = tempTarget;
    const t = new THREE.Vector3().set(
      targetThreePosition.x,
      targetThreePosition.y,
      targetThreePosition.z
    );
    return {
      pos: t.add(v.multiplyScalar(distance)),
      distance,
    };
  }

  setTargetBgColor(hex) {
    if (this.targetBgColor) {
      setGroundColor(this.targetBgColor, hex);
    }
    this.ground?.setTargetColor(hex);
  }

  setGroundType(type) {
    this.ground?.setGroundType(type);
  }

  setGroundGridScale(scale) {
    this.ground?.setGridScale(scale);
  }

  animation() {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      if (!this.isRenderingEnabled) return;

      const delta = this.clock.getDelta();
      this.controls.update(delta);
      this.ground?.update(delta);

      if (this.currentBgColor && this.targetBgColor) {
        this.currentBgColor.lerp(this.targetBgColor, 0.1);
        this.renderer.setClearColor(this.currentBgColor);
      }

      // this.decalManager.render();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  setRenderingEnabled(enabled) {
    this.isRenderingEnabled = enabled;
    if (enabled && this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  loadAsync() {
    const loadModels = modelList.map((model) => {
      return new Promise((resolve, reject) => {
        loader.load(
          model.url,
          (gltf) => {
            console.log('Loaded', model.url);
            resolve(gltf);
          },
          undefined,
          (error) => {
            console.error('Error loading', model.url, error);
            reject(error);
          }
        );
      });
    });
  }

  /**
   * @description: 导入衣服模型
   */
  importModel() {
    // set loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(publicPath('/lib/draco/'));
    const ktxLoader = new KTX2Loader();
    ktxLoader.setTranscoderPath(publicPath('/lib/basis/')).detectSupport(this.renderer);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktxLoader);

    this.modelGroup = new THREE.Group();
    this.modelGroup.name = 'modelGroup';
    this.scene.add(this.modelGroup);
    // ---------- test -------
    if (this.options.sportType === 't_shirt') {
      this.modelGroup.scale.set(0.2, 0.2, 0.2);
    }
    const modelList = this.options.model;
    this.resource = {};
    let index = 0;
    modelList.forEach((model, i) => {
      loader.load(publicPath(model.url), (gltf) => {
        const clothGltf = gltf.scene;
        this.resource[model.type] = {
          model: clothGltf,
        };
        if (model.position) {
          clothGltf.position.copy(model.position);
        }
        // clothGltf.scale.multiplyScalar(2);
        console.log(gltf.scene);
        this.modelGroup.add(gltf.scene);
        // The ground is part of the scene but must not affect the model framing.
        this.updateCameraAndControls(this.modelGroup, 'front');
        clothGltf.name = model.type;
        // clothGltf.children.forEach((v) => {
        clothGltf.traverse((v) => {          
          if (v.isMesh) {
            v.geometry.computeBoundsTree();

            v.userData.type = model.type;
            // 设置normalMap为空，去除DirectionalLight对衣服的会有白色块
            // v.material.normalMap = null;
            v.material.map = null;
            // TODO: 袖子
            if (v.name === "c_1_2") {
              return;
            }
            if (!this.resource[model.type].material) {
              this.resource[model.type].material = v.material;
            }
            v.material = this.resource[model.type].material;
          }
        });
        this.pathMesh(model);
        // dispose draco
        index++;
        if (index >= modelList.length) {
          dracoLoader.dispose();
          this.updateNormalMap(this.activeNormalOptions || this.defaultNormalOptions);
          if (this.enableNormalDevTool && !this.normalDevTool && this.glDom) {
            this.normalDevTool = initNormalDevTool({
              hostElement: this.glDom,
              options: this.activeNormalOptions,
              defaultOptions: this.defaultNormalOptions,
              onChange: (normalOptions) => this.updateNormalMap(normalOptions),
            });
          }
          this.fire('model_loaded');
        }
      });
    });
    this.mutateEditor();
  }

  mutateEditor() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.firstHitOnly = true;
    this.mouse = new THREE.Vector2();
    this.lastTouchMoveRaycast = 0;

    const eventList = [
      { type: 'mousemove', method: '_onMouseMove'},
      { type: 'mousedown', method: '_onMouseDown', isDrag:true},
      { type: 'mouseup', method: '_onMouseUp', isDrag:false},
      { type: 'touchstart', method: '_onTouchStart', isDrag:true},
      { type: 'touchmove', method: '_onTouchMove'},
      { type: 'touchend', method: '_onTouchEnd', isDrag:false},
    ];
    this._editorListeners = [];
    eventList.forEach((info) => {
      const listener = (event) => {
        if (!this.renderer || !this.renderer.domElement || !this.camera || !this.modelGroup || !this.resource) return;
        const hasDragKey = 'isDrag' in info;
        if(hasDragKey) {
          this.isDragging = info.isDrag
        }
        if((info.type === 'mousemove' || info.type === 'touchmove') && !this.isDragging) return;
        if (info.type === 'touchmove') {
          const now = performance.now();
          if (now - this.lastTouchMoveRaycast < 32) return;
          this.lastTouchMoveRaycast = now;
        }
        const rect = this.renderer.domElement.getBoundingClientRect(); // canvas 相对于视口的位置
        const pointer = getEventPoint(event);
        // 计算标准设备坐标 (-1 到 1)
        this.mouse.x = ((pointer.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((pointer.clientY - rect.top) / rect.height) * 2 + 1;
        // 设置 raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // 检测交互对象
        const intersects = this.raycaster.intersectObject(this.modelGroup);
        if (intersects.length > 0) {
          event.preventDefault();
          event.stopPropagation();
          if(hasDragKey) this.controls.enabled = !this.isDragging;
          const clicked = intersects[0].object;
          if (!this.resource[clicked.userData.type] || !this.resource[clicked.userData.type].fabricEditor) return;
          const fabricCanvas = this.resource[clicked.userData.type].fabricEditor.canvas;
          const uv = intersects[0].uv1 || intersects[0].uv;
          if (!uv) {
            console.log('no uv');
            return;
          }
  
          const offsetX = uv.x * fabricCanvas.getWidth();
          const offsetY = uv.y * fabricCanvas.getHeight();
          // console.log(info.type, offsetX, offsetY);
          const canvasRect = fabricCanvas.upperCanvasEl.getBoundingClientRect();
          const eventType = info.type === 'touchstart'
            ? 'mousedown'
            : info.type === 'touchmove'
              ? 'mousemove'
              : info.type === 'touchend'
                ? 'mouseup'
                : event.type;
          const simEvt = new MouseEvent(eventType, {
            clientX: canvasRect.left + offsetX,
            clientY: canvasRect.top + offsetY,
            // offsetX,
            // offsetY,
            // pageX: canvasRect.left + offsetX,
            // pageY: canvasRect.top + offsetY,
            button: event.button || 0,
          });
          const method = info.type === 'touchstart'
            ? '_onMouseDown'
            : info.type === 'touchmove'
              ? '_onMouseMove'
              : info.type === 'touchend'
                ? '_onMouseUp'
                : info.method;
          fabricCanvas[method](simEvt);
        }else {
          this.controls.enabled = true
          if(info.type === 'mousedown' || info.type === 'touchstart') {
            // 取消选中
            Object.entries(this.resource).forEach(([key, value]) => {
                value.fabricEditor.clearSelection();
            })
          }
        }
      };
      const listenerOptions = info.type.startsWith('touch') ? { passive: false } : false;
      this.renderer.domElement.addEventListener(info.type, listener, listenerOptions);
      this._editorListeners.push({ type: info.type, listener });
    })
  }

  /**
   * @description: 配置衣服的uv和纹理
   */
  pathMesh(options) {
    const { texture, type } = options;
    // cloth texture
    const _options = {
      type,
      textureSvg: texture.main
    }
    const fabricEditor = new FabricEditor(this, _options);
    this.resource[type].fabricEditor = fabricEditor;
    fabricEditor.texture.colorSpace = THREE.SRGBColorSpace
    let firstMesh = null;
    this.resource[type].model.traverse((v) => {
      if (!v.isMesh) return;
      if (v.name === 'c_1_2') return;
      v.geometry.setAttribute('uv', v.geometry.attributes.uv1 || v.geometry.attributes.uv);
      v.geometry.setAttribute(
        'uvUnified',
        v.geometry.attributes.uv1 || v.geometry.attributes.uv
      );
      v.geometry.setAttribute(
        'uvUnifiedEditor',
        v.geometry.attributes.uv1 || v.geometry.attributes.uv
      );
      // if (!firstMesh) {
      //   firstMesh = v;
      // }
      this.textureModel(
        v,
        this.resource[type].fabricEditor.texture,
        null,
        'MultiplyMixDiffuse'
      );
    });
    // this.textureModel(
    //   firstMesh,
    //   this.resource[type].fabricEditor.texture,
    //   null,
    //   'MultiplyMixDiffuse'
    // );
  }

  /**
   * @description: 纹理绘制
   * @param {THREE.Mesh} mesh mesh
   * @param {Texture} unifiedTexture 底图纹理
   * @param {Texture} editorTexture 文字纹理
   * @param {string} type 渲染类型
   */
  textureModel(mesh, unifiedTexture, editorTexture, type) {
    const material = mesh.material;
    if (material.map) {
      // material.map.colorSpace = THREE.LinearSRGBColorSpace
    }
    material.customProgramCacheKey = function () {
      const mode = (this.userData && this.userData.shaderUniforms && this.userData.shaderUniforms.uDebugNormalMode)
        ? this.userData.shaderUniforms.uDebugNormalMode.value
        : 0;
      return (this.name || 'mat') + '_' + (this.normalMap ? 'hasNorm' : 'noNorm') + '_dbg' + mode;
    };

    material.onBeforeCompile = (m) => {
      m.defines = m.defines || {};
      if (mesh.geometry.attributes.uvUnifiedEditor && editorTexture) {
        m.defines.USE_UNIFIED_EDITOR_UV = '';
      }
      switch (type) {
        case 'MultiplyMixDiffuse':
          m.defines.MIX_TYPE_MULTIPLY_MIX_DIFFUSE = '';
          break;
        case 'ReplaceDiffuse':
          m.defines.MIX_TYPE_REPLACE_DIFFUSE = '';
          break;
        case 'ReplaceMixDiffuse':
          m.defines.MIX_TYPE_REPLACE_MIX_DIFFUSE = '';
          break;
      }
      m.uniforms.unifiedEditorMap = { value: editorTexture };
      m.uniforms.unifiedMap = { value: unifiedTexture };
      m.uniforms.uvUnifiedTransform = { value: new THREE.Matrix3() };
      m.uniforms.uvUnifiedEditorTransform = { value: new THREE.Matrix3() };
      m.uniforms.uDebugNormalMode = {
        value: this.activeNormalOptions?.debugNormalMode !== undefined ? this.activeNormalOptions.debugNormalMode : 0,
      };

      material.userData.shaderUniforms = m.uniforms;

      m.fragmentShader = m.fragmentShader.replace(
        '#include <common>',
        `#include <common>
         uniform sampler2D unifiedMap;
         varying vec2 vUvUnified;
         uniform float uDebugNormalMode;
         #ifdef USE_UNIFIED_EDITOR_UV
          uniform sampler2D unifiedEditorMap;
          varying vec2 vUvUnifiedEditor;
         #endif
      `
      );
      m.fragmentShader = m.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        // SVGs added to diffuse map
        vec4 svgTexelColor;

        // Combine main svg and svg editor color if available
        #ifdef USE_UNIFIED_EDITOR_UV
          vec4 unifiedTexelColor = texture2D(unifiedMap, vUvUnified);
          // Editor SVG w/ different UVs
          vec4 unifiedEditorTexelColor = texture2D(unifiedEditorMap, vUvUnifiedEditor);
          // Combine SVG and Editor SVG
          svgTexelColor = vec4(mix(unifiedTexelColor.rgb, unifiedEditorTexelColor.rgb, unifiedEditorTexelColor.a), unifiedTexelColor.a);
        #else
          svgTexelColor = texture2D(unifiedMap, vUvUnified);
        #endif
        
        // // #ifdef DEBUG_UV
        // // // Combine
        // // if (gl_FragCoord.x <= 900.) {
        // //     //{{colorMixer.ReplaceDiffuse}}
        // // } else if (gl_FragCoord.x > 900. && gl_FragCoord.x < 1050.) {
        // //     //{{colorMixer.ReplaceMixDiffuse}}
        // // } else {
        // //     //{{colorMixer.MultiplyMixDiffuse}}
        // // }
        // // #else
        // // //{{mixer}}
        // // #endif

        // // If texture has diffuse use that (what about vertex colour?)
        #ifdef USE_MAP
          //   svgTexelColor = mapTexelToLinear(svgTexelColor);
          #ifndef MIX_TYPE_REPLACE_DIFFUSE
            #ifdef MIX_TYPE_REPLACE_MIX_DIFFUSE
                //  mix SVG texture and other maps, except for existing diffuse map
                diffuseColor = vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);
            #endif
            #ifdef MIX_TYPE_MULTIPLY_MIX_DIFFUSE
                // multiply SVG with existing diffuse map (requires white material) (comes out darker) e.g. KB-652-I-SS-1-Womens-Inline-Polo-Shirt-Polo-Collar-Multi-Size
                diffuseColor *= vec4(mix(diffuseColor.rgb, svgTexelColor.rgb, svgTexelColor.a), diffuseColor.a);
            #endif
          #endif
        #else
          // TODO:  USE_MAP enables mapTexelToLinear, so if material doesn't have it it's missing - using just sRGBToLinear for now?!
          // https://stackoverflow.com/questions/21630224/three-js-gamma-correction-and-custom-shaders
          // svgTexelColor = sRGBToLinear(svgTexelColor);
          diffuseColor = svgTexelColor;
        #endif

        #ifdef MIX_TYPE_REPLACE_DIFFUSE
          // svgTexelColor = sRGBToLinear(svgTexelColor);
          diffuseColor = svgTexelColor;
        #endif

        #ifdef USE_NORMALMAP
          if (uDebugNormalMode > 0.5 && uDebugNormalMode < 1.5) {
            vec4 normTex = texture2D(normalMap, vNormalMapUv);
            diffuseColor = vec4(normTex.rgb, 1.0);
          }
        #endif
        `
      );
      m.fragmentShader = m.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        if (uDebugNormalMode > 1.5) {
          gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
        }
        `
      );
      m.vertexShader = m.vertexShader.replace(
        '#include <common>',
        `#include <common>
          attribute vec2 uv2;
          varying vec2 vUv2;
          attribute vec2 uvUnified;
          varying vec2 vUvUnified;
          uniform mat3 uvUnifiedTransform;

          #ifdef USE_UNIFIED_EDITOR_UV
            attribute vec2 uvUnifiedEditor;
            varying vec2 vUvUnifiedEditor;
            uniform mat3 uvUnifiedEditorTransform;
          #endif
        `
      );
      m.vertexShader = m.vertexShader.replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
          vUv2 = uv2;
          vUvUnified = ( uvUnifiedTransform * vec3( uvUnified, 1 ) ).xy;
          #ifdef USE_UNIFIED_EDITOR_UV
            vUvUnifiedEditor = ( uvUnifiedEditorTransform * vec3( uvUnifiedEditor, 1 ) ).xy;
          #endif
        `
      );
      material.uniforms = m.uniforms;
    };
    material.needsUpdate = true;
  }

  /**
   * @description: 更新服装法线贴图(Normal Map)面料纹理
   * @param {Object} options { url, scale, repeat, roughness, metalness, debugNormalMode }
   */
  updateNormalMap(options = {}) {
    if (!this.resource) return;

    this.activeNormalOptions = {
      url: options.url !== undefined ? options.url : (this.activeNormalOptions?.url || this.defaultNormalOptions.url),
      scale: options.scale !== undefined ? options.scale : (this.activeNormalOptions?.scale ?? this.defaultNormalOptions.scale),
      repeat: options.repeat !== undefined ? options.repeat : (this.activeNormalOptions?.repeat ?? this.defaultNormalOptions.repeat),
      roughness: options.roughness !== undefined ? options.roughness : (this.activeNormalOptions?.roughness ?? this.defaultNormalOptions.roughness),
      metalness: options.metalness !== undefined ? options.metalness : (this.activeNormalOptions?.metalness ?? this.defaultNormalOptions.metalness),
      debugNormalMode: options.debugNormalMode !== undefined ? options.debugNormalMode : (this.activeNormalOptions?.debugNormalMode ?? this.defaultNormalOptions.debugNormalMode),
    };

    const { url, scale, repeat, roughness, metalness, debugNormalMode } = this.activeNormalOptions;

    const applyToMaterials = (texture, scaleVal, roughnessVal, metalnessVal, debugModeVal, forceRecompile = false) => {
      if (!this.modelGroup) return;

      this.modelGroup.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        if (child.geometry.attributes.uv1) {
          child.geometry.setAttribute('uv', child.geometry.attributes.uv1);
        }

        const mat = child.material;
        const hadNormalMap = !!mat.normalMap;
        const hasNormalMap = !!texture;

        mat.normalMap = texture;
        if (texture) {
          if (!mat.normalScale) {
            mat.normalScale = new THREE.Vector2(scaleVal, scaleVal);
          } else {
            mat.normalScale.set(scaleVal, scaleVal);
          }
          mat.normalMapType = THREE.TangentSpaceNormalMap;
        }
        mat.roughness = roughnessVal;
        mat.metalness = metalnessVal;

        let debugModeChanged = false;
        if (mat.userData && mat.userData.shaderUniforms && mat.userData.shaderUniforms.uDebugNormalMode) {
          if (mat.userData.shaderUniforms.uDebugNormalMode.value !== debugModeVal) {
            mat.userData.shaderUniforms.uDebugNormalMode.value = debugModeVal;
            debugModeChanged = true;
          }
        }

        if (hadNormalMap !== hasNormalMap || debugModeChanged || forceRecompile) {
          mat.needsUpdate = true;
        }
      });
    };

    if (!url) {
      applyToMaterials(null, scale, roughness, metalness, debugNormalMode, true);
      this.currentNormalUrl = null;
      this.currentNormalTexture = null;
      this.renderOnce();
      return;
    }

    if (this.currentNormalUrl === url && this.currentNormalTexture) {
      this.currentNormalTexture.wrapS = THREE.RepeatWrapping;
      this.currentNormalTexture.wrapT = THREE.RepeatWrapping;
      this.currentNormalTexture.repeat.set(repeat, repeat);
      this.currentNormalTexture.updateMatrix();

      applyToMaterials(this.currentNormalTexture, scale, roughness, metalness, debugNormalMode, false);
      this.renderOnce();
      return;
    }

    const loadTextureWithFallback = (targetUrl, fallbackUrl = null) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        resolveTextureUrl(targetUrl),
        (normalTexture) => {
          const previousTexture = this.currentNormalTexture;
          normalTexture.wrapS = THREE.RepeatWrapping;
          normalTexture.wrapT = THREE.RepeatWrapping;
          normalTexture.colorSpace = THREE.NoColorSpace;
          normalTexture.repeat.set(repeat, repeat);
          normalTexture.updateMatrix();
          normalTexture.needsUpdate = true;

          this.currentNormalUrl = targetUrl;
          this.currentNormalTexture = normalTexture;

          applyToMaterials(normalTexture, scale, roughness, metalness, debugNormalMode, true);
          if (previousTexture && previousTexture !== normalTexture) {
            previousTexture.dispose();
          }
          this.renderOnce();
        },
        undefined,
        (err) => {
          if (fallbackUrl && fallbackUrl !== targetUrl) {
            console.warn(`Failed loading normal map from ${targetUrl}, trying fallback ${fallbackUrl}...`);
            loadTextureWithFallback(fallbackUrl, null);
          } else {
            console.warn('Could not load normal map texture:', targetUrl, err);
          }
        }
      );
    };

    const fallback = url.endsWith('.webp')
      ? url.replace(/\.webp$/, '.png')
      : (url.endsWith('.png') ? url.replace(/\.png$/, '.webp') : null);
    loadTextureWithFallback(url, fallback);
  }

  renderOnce() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  switchClothType(type, side) {
    if (type === 'suit') {
      this.resource.pant.model.visible = true;
      this.resource.jersey.model.visible = true;
      // Frame the clothes only; the ground is outside of modelGroup.
      this.updateCameraAndControls(this.modelGroup, side);
    } else {
      for (let key in this.resource) {
        this.resource[key].model.visible = false;
      }
      this.resource[type].model.visible = true;
      this.updateCameraAndControls(this.resource[type].model, side);
    }
  }

  // 根据模型包围盒聚焦
  updateCameraAndControls(group, side) {
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    const fov = this.camera.fov * (Math.PI / 180);
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.8;

    let z = center.z + distance;
    if(side === 'back') {
      z = -z;
    }
    this.camera.position.set(center.x, center.y, z);
    this.camera.lookAt(center);

    this.controls.target.copy(center);
    this.controls.update();
  }

  initGui() {
    const gui = new dat.GUI();
    this.gui = gui;
    const params = {
      backgroundColor: '#ffffff',
    };
    // gui.add(params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
    gui
      .addColor(params, 'backgroundColor')
      .name('Background Color')
      .onChange((color) => {
        this.renderer.setClearColor(color);
      });
  }

  getSvgEditorByType(key) {
    return this.resource[key]?.fabricEditor
  }

  get3DModelSnapshot() {
    if (!this.renderer || !this.scene || !this.camera) return null;
    this.renderer.render(this.scene, this.camera);
    try {
      return this.renderer.domElement.toDataURL('image/png');
    } catch (e) {
      console.error('Failed to capture 3D WebGL render canvas snapshot:', e);
      return null;
    }
  }

  destroy() {
    if (!this.glDom) {
      window.removeEventListener('resize', this.onWindowResize, false);
    } else {
      this.resizeObserver.disconnect();
    }

    // 清理事件监听
    if (this._editorListeners && this.renderer && this.renderer.domElement) {
      this._editorListeners.forEach(({ type, listener }) => {
        this.renderer.domElement.removeEventListener(type, listener);
      });
      this._editorListeners = null;
    }

    // 清理 Three.js 相关资源
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object.texture) {
          object.texture.dispose();
        }
      });
    }

    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement = null;
    }

    // 清理动画循环
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.normalDevTool) {
      this.normalDevTool.dispose();
      this.normalDevTool = null;
    }
    if (this.currentNormalTexture) {
      this.currentNormalTexture.dispose();
      this.currentNormalTexture = null;
    }
    if (this.ground) {
      this.ground.dispose();
      this.ground = null;
    }

    // 清空场景
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    if (this.resource) {
      Object.keys(this.resource).forEach((key) => {
        this.resource[key]?.fabricEditor?.destroy();
      }); // 清空this.resource
    }

    // 清空引用
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.resource = null;
  }
}
