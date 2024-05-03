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
