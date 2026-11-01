import { publicPath } from '../utils/publicPath';

export const svgToDataUrl = (svgStr) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr.trim())}`;
};

export const PatternPresets = [
  {
    id: 'stripes_diag',
    name: 'Diagonal Stripes',
    category: 'Lines',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="#000000" stroke-width="8" stroke-linecap="square"/>
      </svg>
    `)
  },
  {
    id: 'stripes_vert',
    name: 'Vertical Stripes',
    category: 'Lines',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect x="0" y="0" width="20" height="40" fill="#000000"/>
      </svg>
    `)
  },
  {
    id: 'grid_mesh',
    name: 'Grid Mesh',
    category: 'Texture',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path d="M 0 0 L 40 0 L 40 40 L 0 40 Z" fill="none" stroke="#000000" stroke-width="3"/>
      </svg>
    `)
  },
  {
    id: 'polka_dots',
    name: 'Polka Dots',
    category: 'Shapes',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="8" fill="#000000"/>
        <circle cx="0" cy="0" r="4" fill="#000000"/>
        <circle cx="40" cy="0" r="4" fill="#000000"/>
        <circle cx="0" cy="40" r="4" fill="#000000"/>
        <circle cx="40" cy="40" r="4" fill="#000000"/>
      </svg>
    `)
  },
  {
    id: 'camo_tactical',
    name: 'Camo',
    category: 'Camo',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <path d="M 10 10 Q 30 5 40 25 T 70 20 Q 80 40 70 60 T 40 70 Q 20 75 10 50 Z" fill="#000000"/>
        <path d="M 40 0 Q 60 15 75 10 T 80 45 Q 65 70 50 75 T 15 65 Q 30 35 40 0 Z" fill="#000000" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'houndstooth',
    name: 'Houndstooth',
    category: 'Classic',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <polygon points="0,0 20,0 20,20 40,20 40,40 20,40 20,20 0,20" fill="#000000"/>
        <polygon points="20,0 30,0 20,10" fill="#000000"/>
      </svg>
    `)
  },
  {
    id: 'argyle_diamond',
    name: 'Argyle Diamond',
    category: 'Shapes',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
        <polygon points="20,0 40,30 20,60 0,30" fill="#000000"/>
      </svg>
    `)
  },
  {
    id: 'carbon_hexagon',
    name: 'Carbon Hex',
    category: 'Tech',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="100" viewBox="0 0 56 100">
        <path d="M28 66L0 50L0 16L28 0L56 16L56 50Z" fill="none" stroke="#000000" stroke-width="4"/>
        <path d="M28 100L0 84L0 50L28 34L56 50L56 84Z" fill="none" stroke="#000000" stroke-width="4"/>
      </svg>
    `)
  },
  {
    id: 'wave_ripples',
    name: 'Wave Ripples',
    category: 'Lines',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30">
        <path d="M 0 15 Q 15 0 30 15 T 60 15" fill="none" stroke="#000000" stroke-width="5"/>
      </svg>
    `)
  },
  {
    id: 'chevron_waves',
    name: 'Chevron Waves',
    category: 'Lines',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30">
        <polyline points="0,25 30,5 60,25" fill="none" stroke="#000000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)
  },
  {
    id: 'cross_stars',
    name: 'Cross Stars',
    category: 'Shapes',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `)
  },
  {
    id: 'halftone_dots',
    name: 'Halftone Dots',
    category: 'Texture',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="10" cy="10" r="3" fill="#000000"/>
        <circle cx="30" cy="10" r="5" fill="#000000"/>
        <circle cx="10" cy="30" r="7" fill="#000000"/>
        <circle cx="30" cy="30" r="9" fill="#000000"/>
      </svg>
    `)
  },
  // {
  //   id: 'style_svg_1',
  //   name: 'Style Pattern 1',
  //   category: 'Artwork',
  //   url: publicPath('/texture/style/style1.svg')
  // },
  // {
  //   id: 'style_svg_2',
  //   name: 'Style Pattern 2',
  //   category: 'Artwork',
  //   url: publicPath('/texture/style/style2.svg')
  // },
  // {
  //   id: 'style_svg_3',
  //   name: 'Style Pattern 3',
  //   category: 'Artwork',
  //   url: publicPath('/texture/style/style3.svg')
  // },
  // {
  //   id: 'style_svg_4',
  //   name: 'Style Pattern 4',
  //   category: 'Artwork',
  //   url: publicPath('/texture/style/style4.svg')
  // }
];
