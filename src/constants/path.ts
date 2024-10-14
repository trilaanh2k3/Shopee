const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePasssord: '/user/passsord',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  favorite: '/favorite'
} as const
export default path
