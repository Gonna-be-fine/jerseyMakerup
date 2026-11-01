import { ColorPrevList, DefaultTextItem } from "../configs";
import { PatternPresets } from "../configs/patterns";
import { publicPath } from "./publicPath";

const CodexColor = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F1C40F',
  '#8E44AD',
  '#E67E22',
  '#2ECC71',
  '#3498DB',
];
export const fontOptions = [
  {
    fontType: 'NotoSans',
    fontFile: publicPath('/fonts/NotoSansSC.ttf')
  },
  {
    fontType: 'ShipporiAntique',
    fontFile: publicPath('/fonts/ShipporiAntique.ttf')
  },
  {
    fontType: 'Anton',
    fontFile: publicPath('/fonts/Anton.ttf')
  },
  {
    fontType: 'LongCang',
    fontFile: publicPath('/fonts/LongCang.ttf')
  }
];

class StyleManager {
  resolveObjectColor(obj) {
    if (!obj) return '#ffffff';
    if (typeof obj.fill === 'string') return obj.fill;
    if (obj.patternMeta?.bgColor && typeof obj.patternMeta.bgColor === 'string') {
      return obj.patternMeta.bgColor;
    }
    if (typeof obj._originalFill === 'string') {
      return obj._originalFill;
    }
    return '#ffffff';
  }

  getColorParams(objects) {
    const filterObjects = []
    objects.forEach(v => {
      let item = ColorPrevList.find(v1 => v1.id === v.id)
      if (item) {
        item = JSON.parse(JSON.stringify(item))
        item.color = this.resolveObjectColor(v);
        filterObjects.push(item)
      }
    })
    return filterObjects
  }

  getPatternParams(objects) {
    const list = []
    if (!objects) return list;

    objects.forEach((obj) => {
      if (!obj?.id || !obj.patternMeta) return;

      if (!obj.id.startsWith('COLOUR_') && !['Path', 'Polygon', 'Rect'].includes(obj.type)) {
        return;
      }

      const meta = obj.patternMeta;
      const preset = PatternPresets.find((pattern) => pattern.url === meta.url);
      list.push({
        id: preset?.id || `imported_${obj.id}`,
        patternId: preset?.id || `imported_${obj.id}`,
        name: preset?.name || 'Imported Pattern',
        category: preset?.category || 'Artwork',
        targetMode: 'parts',
        targetPartIds: [obj.id],
        url: meta.url || null,
        scale: meta.scale ?? 1,
        angle: meta.angle ?? 0,
        opacity: meta.opacity ?? 1,
        offsetX: meta.offsetX ?? 0,
        offsetY: meta.offsetY ?? 0,
        patternColor: meta.patternColor ?? null,
        bgColorMode: 'use_part_color',
        bgColor: meta.bgColor ?? null,
      });
    });

    return list;
  }

  getImageParams(objects) {
    const list = []
    objects.forEach(v => {
      const isLogo = typeof v.id === 'string' && v.id.startsWith('image-');
      const isSupportedType = v.type === 'Image' || v.type === 'Group';
      if (isLogo && isSupportedType) {
        list.push({
          id: v.id,
          url: v.src || v.sourceUrl || '',
          name: v.logoName || v.id,
          clippedPanelId: v.clippedPanelId || v.clipPath?.id || '',
        })
      }
    })
    return list;
  }

  pickTextOptions(text) {
    const options = JSON.parse(JSON.stringify(DefaultTextItem));
    options.id = text.id;
    for (const key in options) {
      options[key] = text[key];
    }
    return options;
  }

  getTextParams(objects) {
    const list = []
    if (!objects) return list;
    objects.forEach(v => {
      if (v.type === 'CustomText' && v.id && v.id.slice(0, 4) === 'text') {
        const text = v.objects.find(v1 => v1.type === 'Text' || v1.type === 'FabricText' || v1.type === 'text');
        if (text) {
          list.push({ 
            ...this.pickTextOptions(text),
            curveValue: v.curveValue || 50,
            isCurved: true,
            id: v.id
          });
        }
        return;
      }
      if ((v.type === 'Text' || v.type === 'FabricText' || v.type === 'text') && v.id && v.id.slice(0, 4) === 'text') {
        list.push({
          ...this.pickTextOptions(v),
          isCurved: false,
          curveValue: v.curveValue || 50,
          id: v.id          
        });
      }
    })
    return list
  }

  getRenderFromJson(json) {
    const model = json.scene.model;
    return model.map(v => {
      return {
        type: v.type,
        logos: v.texture.main.objects ? this.getImageParams(v.texture.main.objects) : [],
        texts: v.texture.main.objects ? this.getTextParams(v.texture.main.objects) : [],
        colors: v.texture.main.objects ? this.getColorParams(v.texture.main.objects) : [],
        patterns: v.texture.main.objects ? this.getPatternParams(v.texture.main.objects) : [],
      }
    })
  }

  getFontList(svgEl) {
    const list = svgEl.querySelectorAll('image[id*=svg]');
    return Array.from(list).map((v) => {
      return {
        id: v.id,
        url: v.getAttribute('xlink:href'),
      };
    });
  }

  getTextList(svgEl) {
    const texts = svgEl.querySelectorAll('text');
    return Array.from(texts).map(text => {
      const textPath = svgEl.querySelector('#' + text.id + 'text');
      const fontType = text.getAttribute('fontType')
      const pathInside = textPath.querySelector('[textType=inside]')
      const pathMiddle = textPath.querySelector('[textType=middle]')
      const pathOutside = textPath.querySelector('[textType=outside]')
      return {
        id: text.id,
        content: text.textContent,
        fontType,
        fontFile: fontOptions.find(v => v.fontType === fontType).fontFile,
        fontSize: text.getAttribute('font-size'),
        borders: [
          { type: 'outside', color: pathOutside.getAttribute('stroke'), strokeWidth: pathOutside.getAttribute('stroke-width') },
          { type: 'middle',color: pathMiddle.getAttribute('stroke'), strokeWidth: pathMiddle.getAttribute('stroke-width') },
          { type: 'inside',color: pathInside.getAttribute('stroke'), strokeWidth: pathInside.getAttribute('stroke-width') },
        ],
      }
    })
  }
}

export { StyleManager };
