import {API} from '../../constants/APIs';
import {strings} from '../../constants/Localization';
import {SET_APP_STATE} from '../../constants/ReducerEnums';
import {AsyncKeysEnum, LoginTypeEnum, UserTypeEnum} from '../../helpers/enum';
import {POST} from '../../helpers/helperFunctions';
import {
  AsyncGetViaKey,
  AsyncRemoveViaKey,
  AsyncStoreViaKey,
} from '../../helpers/LocalStorage/AsyncStorage';
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
  SET_REFERRAL_CODE,
  SUBMIT_REFERRAL_CODE_ERROR,
  SUBMIT_REFERRAL_CODE_PENDING,
  SUBMIT_REFERRAL_CODE_SUCCESS,
  SUBMIT_SUPPORT_MSG_ERROR,
  SUBMIT_SUPPORT_MSG_PENDING,
  SUBMIT_SUPPORT_MSG_SUCCESS,
  UPDATE_SETTINGS_ERROR,
  UPDATE_SETTINGS_PENDING,
  UPDATE_SETTINGS_SUCCESS,
} from './actionTypes';

export const setAppState = obj => ({
  type: SET_APP_STATE,
  payload: obj,
});

export const setAppAuthState = obj => ({
  type: SET_APP_AUTH_STATE,
  payload: obj,
});

export const setDeviceToken = obj => ({
  type: SET_DEVICE_TOKEN,
  payload: obj,
});

export const setReferralCode = obj => ({
  type: SET_REFERRAL_CODE,
  payload: obj,
});

export function loginUser(email, password) {
  return async (dispatch, getState) => {
    let url = `${API.LOGIN_API}`;
    const deviceToken = getState().authReducer.deviceToken;

    //alert('Device ID: ' + deviceToken);

    let body = {
      email: email,
      password: password,
      gcm_id: deviceToken,
    };

    dispatch(loginUserPending());

    let response = await POST(url, body);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      console.log('Fahad login api response: ', res.response.data);
      if (res.response.status === 'Y') {
        const asyncObject = {
          isAuthenticated: true,
          appState: UserTypeEnum.DIBBS_USER,
          loginType: LoginTypeEnum.LOGIN,
          userInfo: res.response.data,
          referralCode: !!res.response.data.referral_code
            ? res.response.data.referral_code
            : '',
          coupens: !!res.response.data.coupens ? res.response.data.coupens : [],
        };

        AsyncStoreViaKey(AsyncKeysEnum.AUTH_INFO, asyncObject);

        dispatch(loginUserSuccess(res.response.data));
        dispatch(
          setReferralCode({
            referralCode: !!res.response.data.referral_code
              ? res.response.data.referral_code
              : '',
            coupens: !!res.response.data.coupens
              ? res.response.data.coupens
              : [],
          }),
        );
      } else {
        dispatch(loginUserError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(loginUserError(res.response.message));
    } else {
      dispatch(
        loginUserError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const loginUserPending = () => ({
  type: LOGIN_USER_PENDING,
});

export const loginUserSuccess = res => ({
  type: LOGIN_USER_SUCCESS,
  payload: res,
});

export const loginUserError = err => ({
  type: LOGIN_USER_ERROR,
  payload: err,
});

export function registerUser(first_name, last_name, email, password, gender) {
  return async (dispatch, getState) => {
    let url = `${API.REGISTER_API}`;
    const deviceToken = getState().authReducer.deviceToken;

    let body = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      gcm_id: deviceToken,
      notification: 'Y',
      gender: gender,
    };

    dispatch(registerUserPending());

    let response = await POST(url, body);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        // const data = {
        //   customer_id: res.response.data,
        //     first_name: first_name,
        //     last_name: last_name,
        //     email: email,
        //     image: "",
        //     phone: "",
        //     address: "",
        //     token: "5757e94e76de681efd481dc75ba78298"
        // }

        const asyncObject = {
          isAuthenticated: true,
          appState: UserTypeEnum.DIBBS_USER,
          loginType: LoginTypeEnum.REGISTER,
          userInfo: res.response.data,
          referralCode: !!res.response.data.referral_code
            ? res.response.data.referral_code
            : '',
        };

        AsyncStoreViaKey(AsyncKeysEnum.AUTH_INFO, asyncObject);
        dispatch(registerUserSuccess(res.response.data));
        dispatch(
          setReferralCode({
            referralCode: !!res.response.data.referral_code
              ? res.response.data.referral_code
              : '',
          }),
        );
      } else {
        dispatch(registerUserError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(registerUserError(res.response.message));
    } else {
      dispatch(
        registerUserError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const registerUserPending = () => ({
  type: REGISTER_USER_PENDING,
});

export const registerUserSuccess = res => ({
  type: REGISTER_USER_SUCCESS,
  payload: res,
});

export const registerUserError = err => ({
  type: REGISTER_USER_ERROR,
  payload: err,
});

export function forgotPassword(email) {
  return async (dispatch, getState) => {
    let url = `${API.FORGOT_PASSWORD_API}`;
    dispatch(forgotPasswordPending());

    let body = {
      email: email,
    };

    let response = await POST(url, body);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(forgotPasswordSuccess(res.response.data));
      } else {
        dispatch(forgotPasswordError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(forgotPasswordError(res.response.message));
    } else {
      dispatch(
        forgotPasswordError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const forgotPasswordPending = () => ({
  type: FORGOT_PASSWORD_PENDING,
});

export const forgotPasswordSuccess = res => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: res,
});

export const forgotPasswordError = err => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: err,
});

export function logout() {
  return async (dispatch, getState) => {
    let url = `${API.LOGOUT_API}`;
    const userToken = getState().authReducer.userInfo.token;

    let body = {};

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        AsyncRemoveViaKey(AsyncKeysEnum.AUTH_INFO);
        dispatch({
          type: LOGOUT,
        });
      } else {
        AsyncRemoveViaKey(AsyncKeysEnum.AUTH_INFO);
        dispatch({
          type: LOGOUT,
        });
      }
    } else if (response.status === 422) {
      AsyncRemoveViaKey(AsyncKeysEnum.AUTH_INFO);
      dispatch({
        type: LOGOUT,
      });
    } else {
      AsyncRemoveViaKey(AsyncKeysEnum.AUTH_INFO);
      dispatch({
        type: LOGOUT,
      });
    }
  };
}

export function searchFAQs(keyword) {
  return async (dispatch, getState) => {
    let url = `${API.SEARCH_FAQS_API}`;

    dispatch(searchFAQsPending());

    let body = {
      search: keyword,
      start: 0,
      rows: 20,
    };

    let response = await POST(url, body);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          searchFAQsSuccess({
            allFAQsFetched: res.response.data.count < 20 ? true : false,
            searchedFAQs: !!res.response.data.faqs
              ? res.response.data.faqs
              : [],
          }),
        );
      } else {
        dispatch(searchFAQsError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(searchFAQsError(res.response.message));
    } else {
      dispatch(
        searchFAQsError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const searchFAQsPending = () => ({
  type: SEARCH_FAQS_PENDING,
});

export const searchFAQsSuccess = res => ({
  type: SEARCH_FAQS_SUCCESS,
  payload: res,
});

export const searchFAQsError = err => ({
  type: SEARCH_FAQS_ERROR,
  payload: err,
});

export function updateSettings(notificattionFlag) {
  return async (dispatch, getState) => {
    let url = `${API.UPDATE_SETTINGS_API}`;
    const userToken = getState().authReducer.userInfo.token;

    dispatch(updateSettingsPending());

    let body = {
      notification: notificattionFlag,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      var res;
      try {
        res = await response.json();

        if (res.response.status === 'Y') {
          AsyncGetViaKey(AsyncKeysEnum.AUTH_INFO).then(obj => {
            if (!!obj) {
              if (!!obj && obj.isAuthenticated) {
                obj.userInfo.notification = notificattionFlag;
                AsyncStoreViaKey(AsyncKeysEnum.AUTH_INFO, obj);

                dispatch(
                  updateSettingsSuccess({
                    newValue: notificattionFlag === 'Y' ? true : false,
                    userInfo: obj.userInfo,
                  }),
                );
              }
            } else {
              dispatch(updateSettingsError('ERROR!'));
            }
          });
        } else {
          dispatch(updateSettingsError(res.response.message));
        }
      } catch (e) {
        dispatch(updateSettingsError('API ERROR!'));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(updateSettingsError(res.response.message));
    } else {
      dispatch(
        updateSettingsError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const updateSettingsPending = () => ({
  type: UPDATE_SETTINGS_PENDING,
});

export const updateSettingsSuccess = res => ({
  type: UPDATE_SETTINGS_SUCCESS,
  payload: res,
});

export const updateSettingsError = err => ({
  type: UPDATE_SETTINGS_ERROR,
  payload: err,
});

export function submitSupportMsg(email, message, orderId) {
  return async (dispatch, getState) => {
    let url = `${API.SUBMIT_SUPPORT_MSG_API}`;
    const userToken = getState().authReducer.userInfo.token;

    dispatch(submitSupportMsgPending());

    let body = {
      email: email,
      message: message,
      order_id: orderId,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      var res;
      try {
        res = await response.json();

        if (res.response.status === 'Y') {
          dispatch(submitSupportMsgSuccess());
        } else {
          dispatch(submitSupportMsgError(res.response.message));
        }
      } catch (e) {
        dispatch(submitSupportMsgError('API ERROR!'));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(submitSupportMsgError(res.response.message));
    } else {
      dispatch(
        submitSupportMsgError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const submitSupportMsgPending = () => ({
  type: SUBMIT_SUPPORT_MSG_PENDING,
});

export const submitSupportMsgSuccess = res => ({
  type: SUBMIT_SUPPORT_MSG_SUCCESS,
});

export const submitSupportMsgError = err => ({
  type: SUBMIT_SUPPORT_MSG_ERROR,
  payload: err,
});

export function submitRefferalCode(referralCode) {
  return async (dispatch, getState) => {
    let url = `${API.SUBMIT_REFERRAL_CODE_API}`;
    const userToken = getState().authReducer.userInfo.token;

    dispatch(submitRefferalCodePending());

    let body = {
      referral_code: referralCode,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      var res;
      try {
        res = await response.json();

        if (res.response.status === 'Y') {
          dispatch(submitRefferalCodeSuccess());
        } else {
          dispatch(submitRefferalCodeError(res.response.message));
        }
      } catch (e) {
        dispatch(submitRefferalCodeError('API ERROR!'));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(submitRefferalCodeError(res.response.message));
    } else {
      dispatch(
        submitRefferalCodeError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const submitRefferalCodePending = () => ({
  type: SUBMIT_REFERRAL_CODE_PENDING,
});

export const submitRefferalCodeSuccess = res => ({
  type: SUBMIT_REFERRAL_CODE_SUCCESS,
});

export const submitRefferalCodeError = err => ({
  type: SUBMIT_REFERRAL_CODE_ERROR,
  payload: err,
});
