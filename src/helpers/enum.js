export const UserTypeEnum = {
  GUEST: 'GUEST',
  DIBBS_USER: 'DIBBS_USER',
  SOCIAL: 'SOCIAL',
};

export const LoginTypeEnum = {
  NONE: 'NONE',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  SOCIAL: 'SOCIAL',
};

export const AsyncKeysEnum = {
  AUTH_INFO: 'AUTH_INFO',
  INTRO_SCREEN: 'INTRO_SCREEN',
  DEVICE_TOKEN: 'DEVICE_TOKEN',
  RECENT_SEAARCH: 'RECENT_SEAARCH',
};

export const AlertTypesEnum = {
  GuestUser: 'GuestUser',
  ForgotPasswordSuccess: 'ForgotPasswordSuccess',
  Logout: 'Logout',
  Redeem: 'Redeem',
  RemoveRecent: 'RemoveRecent',
  Support: 'Support',
  RefferalCode: 'RefferalCode',
  DibbsCredit: 'DibbsCredit',
  DibbsCreditConfirmation: 'DibbsCreditConfirmation',
};

export const CartUpdateActionEnum = {
  Add: 'Add',
  Remove: 'Remove',
};

export const PaymentMethodsEnum = {
  Stripe: 'Stripe',
  PayPal: 'PayPal',
  DibbsCredit: 'DibbsCredit',
  LowDibbsCredit: 'LowDibbsCredit',
};

export const CALL_STATE = {
  IDLE: 'IDLE',
  FETCHING: 'FETCHING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  NULL: 'NULL',
  CLEAR: 'CLEAR',
};

export const Stripe_LIVE = {
  KEY: 'pk_live_51PMveFDMW1AQXKDfoeo56qrtnIXOrGMR36ypdZ9JtKbxdCTO8RVjgE3HvePX6GUwoiUyZHlwvLaQOzILnLtAgCBF006wQ28Ar2',
};

export const Stripe_TEST = {
  KEY: 'pk_test_51PMveFDMW1AQXKDfWTB3j2majlOJqcFC7dNODBuaIoXc7JCp3oiMPid1Qf8Gk1O5ckvbXzwXDWOjoChJ3Grnd4R700usbiU2Hc',
};
