import { publicPath } from '../utils/publicPath';

export const SceneCategories = [
  {
    id: "Basketball",
    name: '篮球服饰',
    subtitle: '热血球场，尽显锋芒',
    description: '为球队打造专属球衣配色、号码与徽章，让每一次上场都更有辨识度。',
    image: publicPath('/images/types/1.jpg'),
    onSale: false
  },
  {
    id: "Football",
    name: '足球服饰',
    subtitle: '绿茵场上，为热爱而战',
    description: '从主客场配色到球员号码，设计属于你们球队的绿茵战袍。',
    image: publicPath('/images/types/2.jpg'),
    onSale: false
  },
  {
    id: "Couple",
    name: '情侣服饰',
    subtitle: '一起穿，更有爱',
    description: '用统一的色彩与专属图案，把两个人的默契穿进日常。',
    image: publicPath('/images/types/3.jpg'),
    onSale: false
  },
  {
    id: "Team",
    name: '团队服饰',
    subtitle: '凝聚团队，创造不凡',
    description: '适合企业、社团与活动团队的统一着装，兼顾舒适、质感与识别度。',
    image: publicPath('/images/types/4.jpg'),
    onSale: false
  },
  {
    id: "Person",
    name: '个性定制',
    subtitle: '释放灵感，定义风格',
    description: '从一件基础款开始，自由组合图案、文字与色彩，做出独一无二的表达。',
    image: publicPath('/images/types/5.jpg'),
    onSale: false
  }
]

export const GenderCategories = [
  { id: "Men", name: '男装' },
  { id: "Women", name: '女装' },
  { id: "Youth", name: '青少年' }
]

export const ClothCategories = [
  { id: 'Tees', name: 'T恤' },
  { id: 'Jerseys', name: '球衣' },
  { id: 'Polos', name: 'Polo衫' },
  { id: 'Singlets', name: '背心' },
  { id: 'Shorts', name: '短裤' },
  { id: 'Hoodies', name: '卫衣' },
  { id: 'Trackpants', name: '运动裤' },
  { id: 'Tracksuits', name: '运动服' }
]
