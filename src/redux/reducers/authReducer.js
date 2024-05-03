import { SET_APP_STATE } from '../../constants/ReducerEnums';
import { LoginTypeEnum, UserTypeEnum } from '../../helpers/enum';
import {
  FORGOT_PASSWORD_ERROR,
  FORGOT_PASSWORD_PENDING,
  FORGOT_PASSWORD_SUCCESS,
  LOGIN_USER_ERROR,
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGOUT,
  REGISTER_USER_ERROR,
  REGISTER_USER_PENDING,
  REGISTER_USER_SUCCESS,
  SEARCH_FAQS_ERROR,
  SEARCH_FAQS_PENDING,
  SEARCH_FAQS_SUCCESS,
  SET_APP_AUTH_STATE,
  SET_DEVICE_TOKEN,
  SUBMIT_REFERRAL_CODE_ERROR,
  SUBMIT_REFERRAL_CODE_PENDING,
  SUBMIT_REFERRAL_CODE_SUCCESS,
  SUBMIT_SUPPORT_MSG_ERROR,
  SUBMIT_SUPPORT_MSG_PENDING,
  SUBMIT_SUPPORT_MSG_SUCCESS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_PENDING,
  UPDATE_SETTINGS_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  appName: 'DIBBS',
  appState: UserTypeEnum.GUEST,
  loginType: LoginTypeEnum.NONE,

  deviceToken: '',

  isVerifying: false,
  isAuthenticated: false,
  userInfo: {},
  authenticationError: '',

  isCreatingUser: false,
  registerError: '',

  isSendingForgotPasswrod: false,
  successfullyEmailSentForgotPassword: false,
  forgotPasswordError: '',

  isSearchingFAQs: false,
  allFAQsFetched: false,
  searchedFAQs: [],
  searchFAQsError: '',

  isUpdatingSettings: false,
  settingsUpdatedSuccessfully: false,
  notificationSettingsCurrentValue: false,
  updatingSettingsError: '',

  isSubmittingSupportMsg: false,
  supportMsgSubmittedSuccessfully: false,
  submitSupportMsgError: '',

  isSubmittingRefferalCode: false,
  referralCodeSubmittedSuccessfully: false,
  referralCodeSubmitError: '',
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_APP_STATE: {
      return {
        ...state, // current state
        appState: action.payload.appState,
      };
    }

    case SET_APP_AUTH_STATE: {
      return {
        ...state,

        appState: action.payload.appState,
        loginType: action.payload.loginType,
        isAuthenticated: action.payload.isAuthenticated,
        userInfo: action.payload.userInfo,
        notificationSettingsCurrentValue:
          !!action.payload.userInfo.notification &&
            action.payload.userInfo.notification === 'Y'
            ? true
            : false,
      };
    }

    case SET_DEVICE_TOKEN: {
      return {
        ...state,

        deviceToken: action.payload.deviceToken,
      };
    }

    case LOGIN_USER_PENDING: {
      return {
        ...state,

        isVerifying: true,
        isAuthenticated: false,
        userInfo: {},
        notificationSettingsCurrentValue: false,
        loginType: LoginTypeEnum.NONE,
        authenticationError: '',
      };
    }

    case LOGIN_USER_SUCCESS: {
      return {
        ...state,

        appState: UserTypeEnum.DIBBS_USER,
        isVerifying: false,
        isAuthenticated: true,
        loginType: LoginTypeEnum.LOGIN,
        userInfo: action.payload,
        notificationSettingsCurrentValue:
          !!action.payload.notification && action.payload.notification === 'Y'
            ? true
            : false,
      };
    }

    case LOGIN_USER_ERROR: {
      return {
        ...state,

        isVerifying: false,
        isAuthenticated: false,
        authenticationError: action.payload,
      };
    }

    case REGISTER_USER_PENDING: {
      return {
        ...state,

        isCreatingUser: true,
        isAuthenticated: false,
        loginType: LoginTypeEnum.NONE,
        userInfo: {},
        notificationSettingsCurrentValue: false,
        registerError: '',
      };
    }

    case REGISTER_USER_SUCCESS: {
      return {
        ...state,

        appState: UserTypeEnum.DIBBS_USER,
        isCreatingUser: false,
        isAuthenticated: true,
        loginType: LoginTypeEnum.REGISTER,
        userInfo: action.payload,
        notificationSettingsCurrentValue:
          !!action.payload.notification && action.payload.notification === 'Y'
            ? true
            : false,
      };
    }

    case REGISTER_USER_ERROR: {
      return {
        ...state,

        isCreatingUser: false,
        isAuthenticated: false,
        registerError: action.payload,
      };
    }

    case FORGOT_PASSWORD_PENDING: {
      return {
        ...state,

        isSendingForgotPasswrod: true,
        successfullyEmailSentForgotPassword: false,
        forgotPasswordError: '',
      };
    }

    case FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,

        isSendingForgotPasswrod: false,
        successfullyEmailSentForgotPassword: true,
      };
    }

    case FORGOT_PASSWORD_ERROR: {
      return {
        ...state,

        isSendingForgotPasswrod: false,
        successfullyEmailSentForgotPassword: false,
        forgotPasswordError: action.payload,
      };
    }

    case SEARCH_FAQS_PENDING: {
      return {
        ...state,

        isSearchingFAQs: true,
        allFAQsFetched: false,
        searchedFAQs: [],
        searchFAQsError: '',
      };
    }

    case SEARCH_FAQS_SUCCESS: {
      return {
        ...state,

        isSearchingFAQs: false,
        allFAQsFetched: action.payload.allFAQsFetched,
        searchedFAQs: action.payload.searchedFAQs,
      };
    }

    case SEARCH_FAQS_ERROR: {
      return {
        ...state,

        isSearchingFAQs: false,
        searchFAQsError: action.payload,
      };
    }

    case UPDATE_SETTINGS_PENDING: {
      return {
        ...state,

        isUpdatingSettings: true,
        settingsUpdatedSuccessfully: false,
        updatingSettingsError: '',
      };
    }

    case UPDATE_SETTINGS_SUCCESS: {
      return {
        ...state,

        isUpdatingSettings: false,
        settingsUpdatedSuccessfully: true,
        notificationSettingsCurrentValue: action.payload.newValue,
        userInfo: action.payload.userInfo,
      };
    }

    case UPDATE_SETTINGS_ERROR: {
      return {
        ...state,

        isUpdatingSettings: false,
        settingsUpdatedSuccessfully: false,
        updatingSettingsError: action.payload,
      };
    }

    case SUBMIT_SUPPORT_MSG_PENDING: {
      return {
        ...state,

        isSubmittingSupportMsg: true,
        supportMsgSubmittedSuccessfully: false,
        submitSupportMsgError: '',
      };
    }

    case SUBMIT_SUPPORT_MSG_SUCCESS: {
      return {
        ...state,

        isSubmittingSupportMsg: false,
        supportMsgSubmittedSuccessfully: true,
      };
    }

    case SUBMIT_SUPPORT_MSG_ERROR: {
      return {
        ...state,

        isSubmittingSupportMsg: false,
        supportMsgSubmittedSuccessfully: false,
        submitSupportMsgError: action.payload,
      };
    }

    case SUBMIT_REFERRAL_CODE_PENDING: {
      return {
        ...state,

        isSubmittingRefferalCode: true,
        referralCodeSubmittedSuccessfully: false,
        referralCodeSubmitError: ''
      };
    }

    case SUBMIT_REFERRAL_CODE_SUCCESS: {
      return {
        ...state,

        isSubmittingRefferalCode: false,
        referralCodeSubmittedSuccessfully: true,
      };
    }

    case SUBMIT_REFERRAL_CODE_ERROR: {
      return {
        ...state,

        isSubmittingRefferalCode: false,
        referralCodeSubmittedSuccessfully: false,
        referralCodeSubmitError: action.payload,
      };
    }

    case LOGOUT: {
      return {
        ...state, // current state
        appState: UserTypeEnum.GUEST,

        isAuthenticated: false,
        loginType: LoginTypeEnum.NONE,
        userInfo: {},
        notificationSettingsCurrentValue: false,
        authenticationError: '',
      };
    }

    default:
      return state;
  }
}
