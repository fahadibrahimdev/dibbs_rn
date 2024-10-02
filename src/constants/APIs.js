const DEV = {
  DOMAIN: 'https://dibbs.sastidukan.com/',
  BASE_URL: 'https://dibbs.sastidukan.com/rest/api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

const UAT = {
  DOMAIN: 'https://dibbs.thundertechsol.com.com/',
  BASE_URL: 'https://dibbs.thundertechsol.com/rest/api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

const PROD = {
  DOMAIN: 'https://new.thedibbsapp.com/',
  BASE_URL: 'https://new.thedibbsapp.com/rest/api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

const PROD_2 = {
  DOMAIN: 'https://store.thedibbsapp.com/',
  BASE_URL: 'https://store.thedibbsapp.com/rest/api',
  STRIPE_VERCEL_URL: 'https://stripe-api-nx.vercel.app/api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

const PROD_WITH_LIVE_STRIPE = {
  DOMAIN: 'https://store.thedibbsapp.com/',
  BASE_URL: 'https://store.thedibbsapp.com/rest/api',
  STRIPE_VERCEL_URL: 'https://stripe-nx-api-live.vercel.app//api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

const UAT_Thunder = {
  DOMAIN: 'https://dibbs.thundertechsol.com/',
  BASE_URL: 'https://dibbs.thundertechsol.com/rest/api',
  STRIPE_VERCEL_URL: 'https://stripe-api-nx.vercel.app/api',
  TOKEN: '',
  appId: '1',
  appKey: 'c4ca4238a0b923820dcc509a6f75849b',
};

export const ENV = PROD_WITH_LIVE_STRIPE;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const HEADERS = {
  COMMON: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const APP_CONSTANTS = {
  IMAGE_BASE_URL: ENV.DOMAIN,
};

export const API = {
  LOGIN_API: `${ENV.BASE_URL}/login/login`,
  REGISTER_API: `${ENV.BASE_URL}/login/register`,
  FORGOT_PASSWORD_API: `${ENV.BASE_URL}/login/forgotPassword`,
  SEARCH_FAQS_API: `${ENV.BASE_URL}/faqs/search`,

  SEARCH_PRODUCTS_API: `${ENV.BASE_URL}/products/search`,
  SEARCH_PRODUCTS_WITHOUT_TOKEN_API: `${ENV.BASE_URL}/login/searchProducts`,

  GET_CATEGORIES_API: `${ENV.BASE_URL}/login/categories`,
  GET_CATEGORIES_WITH_TOKEN_API: `${ENV.BASE_URL}/products/categories`,

  SAVE_PRODUCT_API: `${ENV.BASE_URL}/products/save`,
  REMOVE_PRODUCT_API: `${ENV.BASE_URL}/products/delMyProduct`,
  GET_MY_SAVED_PRODUCTS_API: `${ENV.BASE_URL}/products/myProducts`,

  CREATE_ORDER_API: `${ENV.BASE_URL}/orders/create`,
  CONFIRM_ORDER_API: `${ENV.BASE_URL}/orders/payment`,

  GET_MY_ORDERS_API: `${ENV.BASE_URL}/orders/myOrders`,
  REDEEM_ORDERS_API: `${ENV.BASE_URL}/orders/redeem`,

  UPDATE_SETTINGS_API: `${ENV.BASE_URL}/user/updateProfileSetting`,

  SUBMIT_SUPPORT_MSG_API: `${ENV.BASE_URL}/user/support`,

  SUBMIT_REFERRAL_CODE_API: `${ENV.BASE_URL}/user/addReferral`,

  LOGOUT_API: `${ENV.BASE_URL}/user/logout`,

  STRIPE_PAYMENT_API: `${ENV.STRIPE_VERCEL_URL}/stripe`,

  DELETE_ACCOUNT_API: `${ENV.BASE_URL}/delete_user`,
};
