// CustomText.js
import {
  Group,
  FabricText,
  classRegistry,
  Rect,
  Path,
  StaticCanvas,
} from 'fabric';

export default class CustomText extends Group {
  static type = 'CustomText';
  /**
   * ---- 允许导出的属性列表 ----
   */
  static TEXT_PROPS = [
    'fill',
    'fontSize',
    'fontFamily',
    'fontWeight',
    'charSpacing',
    'textAlign',
    'lineHeight',
    'fontStyle',
    'underline',
    'stroke',
    'strokeWidth',
  ];

  constructor(text, options = {}, curveValue = 50) {
    const customTextId = options.id || `custom_text_${Date.now()}`;
    // 拆分 textElement 的属性
    const textOptions = CustomText.pickTextProps(options);

    const defaultOptions = {
      left: options.left || 100,
      top: options.top || 100,
      originX: 'center',
      originY: 'center',
      selectable: true,
      evented: true,
      _isCustomText: true,
      type: 'custom-text',
      id: customTextId,
      objectCaching: false,
      ...textOptions,
    };

    const textElement = new FabricText(text, {
      originX: 'center',
      originY: 'center',
      linkedId: customTextId,
      objectCaching: false,
      ...textOptions,
    });

    const hitbox = new Rect({
      left: textElement.left,
      top: textElement.top,
      fill: 'rgba(0, 0, 255, 0.3)',
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
      opacity: 0,
      linkedId: customTextId,
    });

    super([textElement, hitbox], defaultOptions);

    this.textElement = textElement;
    this.hitbox = hitbox;
    this.curveValue = curveValue;
    this.objectCaching = false;
    this.textElement.objectCaching = false;

    // 监听选中事件 - 显示 path
    this.on('selected', () => {
      this._showPath();
      this.updateProperties({ curveValue: this.curveValue });
    });

    // 监听取消选中事件 - 隐藏 path
    this.on('deselected', () => {
      this._hidePath();
      this.updateProperties({ curveValue: this.curveValue });
    });
  }

  init() {}

  _showPath() {
    if (this.textElement.path) {
      this.textElement.path.set({
        opacity: 1,
        visible: true,
        left: this.textElement.path.left,
        top: this.textElement.path.top,
      });
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }
  }

  _hidePath() {
    if (this.textElement.path) {
      this.textElement.path.set({
        opacity: 0,
        visible: false,
        left: this.textElement.left,
        top: this.textElement.top,
      });
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }
  }

  /**
   * ---- 从 options 中提取 textElement 的属性 ----
   */
  static pickTextProps(options) {
    const result = {};
    CustomText.TEXT_PROPS.forEach((key) => {
      if (options[key] !== undefined) {
        result[key] = options[key];
      }
    });
    return result;
  }

  /**
   * 导出对象表示,包含 curveValue
   */
  toObject(propertiesToInclude = []) {
    return {
      ...super.toObject([
        ...CustomText.TEXT_PROPS,
        'id',
        ...propertiesToInclude,
      ]),
      curveValue: this.curveValue,
      id: this.id,
      text: this.textElement.text,
    };
  }

  static async fromObject(object, options = {}) {
    const { canvas } = options || {};
    const { text, ...rest } = object;
    const textOptions = object.objects.find((v) => v.type === 'Text' || v.type === 'FabricText' || v.type === 'text');
    const obj = {
      ...rest,
      ...CustomText.pickTextProps(textOptions),
    };
    const instance = new CustomText(text, obj);
    const curveValue = object.curveValue || 50;
    const charSpacing = textOptions.charSpacing || 0;

    if (canvas) instance.canvas = canvas;

    // 恢复弧形文本
    if (canvas || instance.canvas) {
      instance.applyCurvedText(curveValue, charSpacing, canvas || instance.canvas);
    } else {
      // 若无 canvas，在 added 时立即执行
      instance.on('added', () => {
        if (instance.canvas) {
          instance.applyCurvedText(curveValue, charSpacing, instance.canvas);
        }
      });
    }

    return instance;
  }

  toSVG() {
    let svg = super.toSVG();
    // 修复任何属性之间缺少空格的问题
    svg = svg.replace(/"([a-z-]+)=/g, '" $1=');
    return svg;
  }

  /**
   * 批量更新文本元素的属性(性能优化版本)
   * @param {object} options - 属性对象
   */
  updateProperties(options) {
    if (typeof options !== 'object' || !options) {
      return this;
    }

    // 区分组级属性（如位置、缩放等）和文本元素本身独有的样式/内容属性
    const groupKeys = ['left', 'top', 'scaleX', 'scaleY', 'angle', 'visible', 'opacity', 'id', 'flipX', 'flipY'];
    const groupProps = {};
    const textProps = {};

    Object.keys(options).forEach((key) => {
      if (groupKeys.includes(key)) {
        groupProps[key] = options[key];
      } else if (CustomText.TEXT_PROPS.includes(key) || key === 'text') {
        textProps[key] = options[key];
      }
    });

    if (Object.keys(groupProps).length > 0) {
      this.set(groupProps);
    }
    if (Object.keys(textProps).length > 0) {
      this.textElement.set(textProps);
    }

    // 检查是否有影响布局的属性
    const layoutAffectingProps = [
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'text',
      'charSpacing',
      'lineHeight',
      'textAlign',
    ];

    let needsUpdate =
      Object.keys(options).some((k) => layoutAffectingProps.includes(k)) ||
      options.curveValue !== undefined;

    if (options.curveValue) {
      this.curveValue = options.curveValue;
    }
    // needsUpdate = false;
    // 只执行一次更新
    if (needsUpdate && this.canvas) {
      this.applyCurvedText(
        this.curveValue,
        this.textElement.charSpacing,
        this.canvas
      );
    } else {
      this.triggerLayout();
      this.setCoords();
      this.dirty = true;
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }

    return this;
  }

  /**
   * 更新文本元素的属性
   */
  updateTextProperty(key, value) {
    this.textElement.set(key, value);

    const layoutAffectingProps = [
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'text',
      'charSpacing',
      'lineHeight',
      'textAlign',
    ];

    if (key === 'curveValue') {
      this.curveValue = value;
    }

    let needsUpdate = false;
    if (typeof key === 'object') {
      needsUpdate = Object.keys(key).some((k) =>
        layoutAffectingProps.includes(k)
      );
    } else {
      needsUpdate = layoutAffectingProps.includes(key);
    }

    if ((needsUpdate && this.canvas) || key === 'curveValue') {
      this.applyCurvedText(
        this.curveValue,
        this.textElement.charSpacing,
        this.canvas
      );
    } else {
      this.triggerLayout();
      this.setCoords();
      this.dirty = true;
      if (this.canvas) {
        this.canvas.requestRenderAll();
      }
    }

    return this;
  }

  /**
   * 获取文本元素的属性
   */
  getTextProperty(key) {
    return this.textElement.get(key);
  }

  applyCurvedText(curveValue, charSpacingValue, canvas) {
    if (!canvas) canvas = this.canvas;
    if (this.textElement.text === '') return;
    this.curveValue = curveValue;
    const activeText = this.textElement;
    const hitbox = this.hitbox;

    activeText.set({ charSpacing: charSpacingValue });

    const textWidth = activeText.calcTextWidth();
    const curveIntensity = Math.abs(curveValue - 50);
    const sweepFlag = curveValue < 50 ? 0 : 1;

    let pathD = '';
    let startX, endX, startY, endY, radius, theta;

    if (curveIntensity === 0) {
      const padding = Math.max(activeText.fontSize * 0.8, 30);
      startX = -(textWidth / 2 + padding);
      endX = textWidth / 2 + padding;
      startY = 0;
      endY = 0;
      pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      theta = Math.PI * (curveIntensity / 50);
      radius = textWidth / theta;
      const padding = Math.max(activeText.fontSize * 0.8, 30);
      const extraTheta = padding / radius;
      const totalTheta = theta + 2 * extraTheta;
      startX = Math.floor(-radius * Math.sin(totalTheta / 2) * 10) / 10;
      endX = Math.ceil(radius * Math.sin(totalTheta / 2) * 10) / 10;
      startY = 0;
      endY = 0;
      pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 0 ${sweepFlag} ${endX} ${endY}`;
    }

    const isSelected = this.canvas && this.canvas.getActiveObject() === this;
    const newPath = new Path(pathD, {
      fill: '',
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: isSelected ? 1 : 0,
      visible: isSelected,
    });

    activeText.set({
      path: newPath,
      pathSide: 'center',
      pathAlign: 'center',
      pathStartOffset: 0,
      charSpacing: charSpacingValue,
    });

    const bounds = this.getObjectPixelBounds(activeText, canvas);
    hitbox.set({
      width: bounds.width,
      height: bounds.height,
      opacity: 0,
    });

    hitbox.setCoords();
    this.triggerLayout();
    this.setCoords();
    this.dirty = true;
    canvas.requestRenderAll();
  }

  getObjectPixelBounds(object, canvas) {
    const textWidth = Math.max(object.calcTextWidth(), 10);
    const curveValue = this.curveValue !== undefined ? this.curveValue : 50;
    const curveIntensity = Math.abs(curveValue - 50);
    const heightFallback = object.height || 30;

    if (curveIntensity <= 0.1) {
      return {
        width: textWidth,
        height: heightFallback
      };
    } else {
      const theta = Math.PI * (curveIntensity / 50);
      const radius = textWidth / theta;
      const w = 2 * radius * Math.sin(theta / 2);
      const h = radius * (1 - Math.cos(theta / 2)) + heightFallback;
      return {
        width: w,
        height: h
      };
    }
  }
}

classRegistry.setClass(CustomText);
