import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { createOrganizationSchema, setSeo } from '../utils/seo'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      sidebar: false,
      seo: {
        title: 'MoMoFit 团队服饰定制 - AI在线设计球衣T恤Polo衫',
        description: '在线定制篮球服、足球服、Polo 衫和团队活动服，支持 3D 预览、AI 徽章、队名号码编辑、设计包导出和客服生产对接。',
        canonicalPath: '/',
        schema: createOrganizationSchema(),
      },
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      sidebar: false,
      seo: {
        title: '登录 - MoMoFit',
        description: '登录 MoMoFit 管理你的球衣设计、购物车和积分余额。',
        noindex: true,
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      sidebar: false,
      seo: {
        title: '注册 - MoMoFit',
        description: '注册 MoMoFit 账号，保存你的 3D 球衣设计和定制订单信息。',
        noindex: true,
      },
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: {
      sidebar: false,
      seo: {
        title: '找回密码 - MoMoFit',
        description: '找回 MoMoFit 账号密码。',
        noindex: true,
      },
    },
  },
  {
    path: '/recharge',
    name: 'Recharge',
    component: () => import('../views/Recharge.vue'),
    meta: {
      sidebar: false,
      seo: {
        title: '积分充值 - MoMoFit',
        description: '为 MoMoFit 在线设计功能充值积分，添加客服微信完成账号充值和生产对接。',
        noindex: true,
      },
    },
  },
  {
    path: '/design/:productId',
    name: 'Design',
    component: () => import('../views/Design.vue'),
    props: true,
    meta: {
      sidebar: false,
      sidebarKey: 'admin',
      seo: {
        title: '在线 3D 球衣设计器 - MoMoFit',
        description: '使用 MoMoFit 在线设计器编辑球衣颜色、队名、号码、Logo 和图案，并导出设计包用于定制生产。',
        noindex: true,
      },
    },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/ProductList.vue'),
    meta: {
      sidebar: false,
      sidebarKey: 'admin',
      seo: {
        title: '团队服饰款式列表 - 球衣T恤Polo衫 | MoMoFit',
        description: '浏览 MoMoFit 可定制款式，选择篮球服、足球服、团队 Polo 衫和 T 恤模板，支持队名、号码、Logo 和配色在线编辑。',
        canonicalPath: '/products',
        noindexQuery: true,
      },
    },
  },
  {
    path: '/import-design',
    name: 'ImportDesign',
    component: () => import('../views/ImportDesign.vue'),
    meta: {
      sidebar: false,
      seo: {
        title: '导入设计包 - MoMoFit',
        description: '导入已导出的 MoMoFit 设计文件，继续编辑你的球衣定制方案。',
        noindex: true,
      },
    },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    props: true,
    meta: {
      sidebar: false,
      seo: {
        title: '定制球衣商品详情 - MoMoFit',
        description: '查看 MoMoFit 定制运动服款式的价格、图片、尺码、面料特点和在线设计入口。',
      },
    },
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: () => import('../views/Test.vue'),
  //   props: true,
  //   meta: {
  //     seo: {
  //       title: '测试页面 - MoMoFit',
  //       description: 'MoMoFit 内部测试页面。',
  //       noindex: true,
  //     },
  //   },
  // },
]

const router = createRouter({
  history: createWebHistory('/aijersey/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    
    if (to.meta.scrollToTop === false) {
      return {};
    }
    
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

router.afterEach((to) => {
  const seo = to.meta?.seo || {}
  const hasQuery = Object.keys(to.query || {}).length > 0

  setSeo({
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath || to.path,
    image: seo.image,
    noindex: Boolean(seo.noindex || (seo.noindexQuery && hasQuery)),
    schema: seo.schema,
  })
})

export default router