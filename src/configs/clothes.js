import { publicPath } from '../utils/publicPath';

export const SceneCategories = [
  {
    id: "Basketball",
    name: '篮球服饰',
    subtitle: '赛场背心系列 / 特厚排汗网眼',
    description: '精英篮球背心及运动短裤，特调高弹速干织物与透气网眼，助力热血赛场。',
    image: publicPath('/images/basketball_flatlay.jpg'),
    onSale: false
  },
  {
    id: "Football",
    name: '足球服饰',
    subtitle: '绿茵战袍系列 / 蜂窝超轻透气',
    description: '经典竖条纹足球训练服与运动短裤，超轻散热纤维，提供全天候畅爽。',
    image: publicPath('/images/football_flatlay.jpg'),
    onSale: false
  },
  {
    id: "Couple",
    name: '情侣服饰',
    subtitle: '情侣T恤系列 / 240g精梳纯棉',
    description: '高街生活轻量版型，精美质感细绒贴签，情侣撞色日常时尚出街首选。',
    image: publicPath('/images/couple_tshirt.jpg'),
    onSale: false
  },
  {
    id: "Team",
    name: '团队服饰',
    subtitle: '精英POLO系列 / 商务活力立领',
    description: '三色针织高端POLO短袖，舒适挺拔面料，适合班级、运动俱乐部和企业高规格定制。',
    image: publicPath('/images/team_polo.jpg'),
    onSale: false
  },
  {
    id: "Person",
    name: '个性定制',
    subtitle: '创意灵感系列 / 无感白胚模版',
    description: '全棉高挺白底空胚，支持零门槛 AI 微晶徽标快速渲染与一体化高精刺绣。',
    image: publicPath('/images/creative_tshirt.jpg'),
    onSale: false
  }
]

export const GenderCategories = [
  {
    id: "Men",
    name: '男装'
  },
  {
    id: "Women",
    name: '女装'
  },
  {
    id: "Youth",
    name: '青少年'
  }
]

export const ClothCategories = [
  {
    id: 'Tees',
    name: 'T恤'
  },
  {
    id: 'Jerseys',
    name: '球衣'
  },
  {
    id: 'Polos',
    name: 'Polo衫'
  },
  {
    id: 'Singlets',
    name: '背心'
  },
  {
    id: 'Shorts',
    name: '短裤'
  },
  {
    id: 'Hoodies',
    name: '卫衣'
  },
  {
    id: 'Trackpants',
    name: '运动裤'
  },
  {
    id: 'Tracksuits',
    name: '运动服'
  }
]
