import {API} from '../../constants/APIs';
import {strings} from '../../constants/Localization';
import {GET, POST} from '../../helpers/helperFunctions';
import {
  MY_SAVED_PRODUCTS_ERROR,
  MY_SAVED_PRODUCTS_PENDING,
  MY_SAVED_PRODUCTS_SUCCESS,
  REMOVE_PRODUCT_ERROR,
  REMOVE_PRODUCT_PENDING,
  REMOVE_PRODUCT_SUCCESS,
  SAVE_PRODUCT_ERROR,
  SAVE_PRODUCT_PENDING,
  SAVE_PRODUCT_SUCCESS,
  SEARCH_DEALS_ERROR,
  SEARCH_DEALS_PENDING,
  SEARCH_DEALS_SUCCESS,
  SEARCH_PRODUCTS_PENDING,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_ERROR,
  CLEAR_SEARCH_PRODUCTS,
  GET_CATEGORIES_INFO_PENDING,
  GET_CATEGORIES_INFO_SUCCESS,
  GET_CATEGORIES_INFO_ERROR,
  CLEAR_GET_CATEGORIES_INFO,
  GET_CATEGORIES_INFO_IDLE,
  SEARCH_DEALS_VIA_CATEGORY_PENDING,
  SEARCH_DEALS_VIA_CATEGORY_SUCCESS,
  SEARCH_DEALS_VIA_CATEGORY_ERROR,
  GET_CATEGORIES_INFO_WITH_TOKEN_IDLE,
  GET_CATEGORIES_INFO_WITH_TOKEN_PENDING,
  GET_CATEGORIES_INFO_WITH_TOKEN_SUCCESS,
  GET_CATEGORIES_INFO_WITH_TOKEN_ERROR,
  CLEAR_GET_CATEGORIES_INFO_WITH_TOKEN,
} from './actionTypes';

export function searchDeals(keyword) {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${
      !!userToken
        ? API.SEARCH_PRODUCTS_API
        : API.SEARCH_PRODUCTS_WITHOUT_TOKEN_API
    }`;

    dispatch(searchDealsPending());

    let body = {
      keywords: keyword,
      start: 0,
      rows: 100,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          searchDealsSuccess({
            allCoupons: res.response.data.coupens,
            couponAmount: res.response.data.coupen_amount,
            couponCode: res.response.data.coupen_code,
            referralCode: res.response.data.referral_code,
            dibbsCredits: res.response.data.dibbs_credits,
            appUrl: !!res.response.data.app_url
              ? res.response.data.app_url
              : 'https://play.google.com/store/apps/details?id=com.thunder.dibbs',
            allDealsFetched: res.response.data.count < 20 ? true : false,
            searchedDeals: !!res.response.data.products
              ? res.response.data.products
              : [],
          }),
        );
      } else {
        dispatch(searchDealsError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(searchDealsError(res.response.message));
    } else {
      dispatch(
        searchDealsError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const searchDealsPending = () => ({
  type: SEARCH_DEALS_PENDING,
});

export const searchDealsSuccess = res => ({
  type: SEARCH_DEALS_SUCCESS,
  payload: res,
});

export const searchDealsError = err => ({
  type: SEARCH_DEALS_ERROR,
  payload: err,
});

export function searchDealsViaCategory(keyword, categoryID) {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${
      !!userToken
        ? API.SEARCH_PRODUCTS_API
        : API.SEARCH_PRODUCTS_WITHOUT_TOKEN_API
    }`;

    dispatch(searchDealsViaCategoryPending());

    let body = {
      keywords: keyword,
      start: 0,
      rows: 20,
      category_id: categoryID,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          searchDealsViaCategorySuccess({
            allCoupons: res.response.data.coupens,
            couponAmount: res.response.data.coupen_amount,
            couponCode: res.response.data.coupen_code,
            referralCode: res.response.data.referral_code,
            dibbsCredits: res.response.data.dibbs_credits,
            appUrl: !!res.response.data.app_url
              ? res.response.data.app_url
              : 'https://play.google.com/store/apps/details?id=com.thunder.dibbs',
            allDealsFetched: res.response.data.count < 20 ? true : false,
            searchedDeals: !!res.response.data.products
              ? res.response.data.products
              : [],
          }),
        );
      } else {
        dispatch(searchDealsViaCategoryError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(searchDealsViaCategoryError(res.response.message));
    } else {
      dispatch(
        searchDealsViaCategoryError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const searchDealsViaCategoryPending = () => ({
  type: SEARCH_DEALS_VIA_CATEGORY_PENDING,
});

export const searchDealsViaCategorySuccess = res => ({
  type: SEARCH_DEALS_VIA_CATEGORY_SUCCESS,
  payload: res,
});

export const searchDealsViaCategoryError = err => ({
  type: SEARCH_DEALS_VIA_CATEGORY_ERROR,
  payload: err,
});

export function searchProducts(keyword) {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${
      !!userToken
        ? API.SEARCH_PRODUCTS_API
        : API.SEARCH_PRODUCTS_WITHOUT_TOKEN_API
    }`;

    dispatch(searchProductsPending());

    let body = {
      keywords: keyword,
      start: 0,
      rows: 20,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          searchProductsSuccess({
            allDealsFetched: res.response.data.count < 20 ? true : false,
            searchedProducts: !!res.response.data.products
              ? res.response.data.products
              : [],
          }),
        );
      } else {
        dispatch(
          searchProductsError({
            error: res.response.message,
            productsSearchedSuccessfully: false,
          }),
        );
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(
        searchProductsError({
          error: res.response.message,
          productsSearchedSuccessfully:
            res.response.message === 'No Product found against this search'
              ? true
              : false,
        }),
      );
    } else {
      dispatch(
        searchProductsError({
          error: !!response.message ? response.message : strings.networkError,
          productsSearchedSuccessfully: false,
        }),
      );
    }
  };
}

export const searchProductsPending = () => ({
  type: SEARCH_PRODUCTS_PENDING,
});

export const searchProductsSuccess = res => ({
  type: SEARCH_PRODUCTS_SUCCESS,
  payload: res,
});

export const searchProductsError = err => ({
  type: SEARCH_PRODUCTS_ERROR,
  payload: err,
});

export const clearSearchProductsInfo = () => ({
  type: CLEAR_SEARCH_PRODUCTS,
});

export function categoriesInfoAPI(keyword) {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${API.GET_CATEGORIES_API}`;

    dispatch(categoriesInfoPending());

    let response = await GET(url, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.success === 'Y') {
        dispatch(
          categoriesInfoSuccess({
            data: res.response.data.length > 0 ? res.response.data : [],
          }),
        );
      } else {
        dispatch(
          categoriesInfoError({
            error: res.response.message,
            productsSearchedSuccessfully: false,
          }),
        );
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(
        categoriesInfoError({
          error: res.response.message,
          productsSearchedSuccessfully:
            res.response.message === 'No Product found against this search'
              ? true
              : false,
        }),
      );
    } else {
      dispatch(
        categoriesInfoError({
          error: !!response.message ? response.message : strings.networkError,
          productsSearchedSuccessfully: false,
        }),
      );
    }
  };
}

export const categoriesInfoIdle = () => ({
  type: GET_CATEGORIES_INFO_IDLE,
});

export const categoriesInfoPending = () => ({
  type: GET_CATEGORIES_INFO_PENDING,
});

export const categoriesInfoSuccess = res => ({
  type: GET_CATEGORIES_INFO_SUCCESS,
  payload: res,
});

export const categoriesInfoError = err => ({
  type: GET_CATEGORIES_INFO_ERROR,
  payload: err,
});

export const clearCategoriesInfoInfo = () => ({
  type: CLEAR_GET_CATEGORIES_INFO,
});

export function categoriesInfoWithTokenAPI(keyword) {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${API.GET_CATEGORIES_WITH_TOKEN_API}`;

    dispatch(categoriesInfoWithTokenPending());

    let response = await GET(url, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.success === 'Y') {
        dispatch(
          categoriesInfoWithTokenSuccess({
            data: res.response.data.length > 0 ? res.response.data : [],
          }),
        );
      } else {
        dispatch(
          categoriesInfoWithTokenError({
            error: res.response.message,
            productsSearchedSuccessfully: false,
          }),
        );
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(
        categoriesInfoWithTokenError({
          error: res.response.message,
          productsSearchedSuccessfully:
            res.response.message === 'No Product found against this search'
              ? true
              : false,
        }),
      );
    } else {
      dispatch(
        categoriesInfoWithTokenError({
          error: !!response.message ? response.message : strings.networkError,
          productsSearchedSuccessfully: false,
        }),
      );
    }
  };
}

export const categoriesInfoWithTokenIdle = () => ({
  type: GET_CATEGORIES_INFO_WITH_TOKEN_IDLE,
});

export const categoriesInfoWithTokenPending = () => ({
  type: GET_CATEGORIES_INFO_WITH_TOKEN_PENDING,
});

export const categoriesInfoWithTokenSuccess = res => ({
  type: GET_CATEGORIES_INFO_WITH_TOKEN_SUCCESS,
  payload: res,
});

export const categoriesInfoWithTokenError = err => ({
  type: GET_CATEGORIES_INFO_WITH_TOKEN_ERROR,
  payload: err,
});

export const clearCategoriesInfoWithTokenInfo = () => ({
  type: CLEAR_GET_CATEGORIES_INFO_WITH_TOKEN,
});

export function saveProduct(product_id) {
  return async (dispatch, getState) => {
    let url = `${API.SAVE_PRODUCT_API}`;
    dispatch(saveProductPending());

    let body = {
      product_id: product_id,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        if (res.response.message === 'Product successfully saved') {
          let currentProducts = getState().productReducer.searchedDeals;
          let currentProductsVIACategory =
            getState().productReducer.searchedDealsVIACategory;

          let currentProductIndex = currentProducts.findIndex(
            obj => obj.product_id === product_id,
          );
          if (currentProductIndex >= 0) {
            currentProducts[currentProductIndex].mySavedProduct = 'Y';
          }

          let currentProductVIACategoryIndex =
            currentProductsVIACategory.findIndex(
              obj => obj.product_id === product_id,
            );
          if (currentProductVIACategoryIndex >= 0) {
            currentProductsVIACategory[
              currentProductVIACategoryIndex
            ].mySavedProduct = 'Y';
          }

          dispatch(
            saveProductSuccess({
              updatedProducts: currentProducts,
              updatedProductsVIACategory: currentProductsVIACategory,
            }),
          );
        } else {
          dispatch(saveProductError(res.response.message));
        }
      } else {
        dispatch(saveProductError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(saveProductError(res.response.message));
    } else {
      dispatch(
        saveProductError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const saveProductPending = () => ({
  type: SAVE_PRODUCT_PENDING,
});

export const saveProductSuccess = res => ({
  type: SAVE_PRODUCT_SUCCESS,
  payload: res,
});

export const saveProductError = err => ({
  type: SAVE_PRODUCT_ERROR,
  payload: err,
});

export function removeProduct(product_id) {
  return async (dispatch, getState) => {
    let url = `${API.REMOVE_PRODUCT_API}`;
    dispatch(removeProductPending());

    let body = {
      product_id: product_id,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        if (res.response.message === 'Product successfully deleted') {
          let currentProducts = getState().productReducer.searchedDeals;

          let currentProductsVIACategory =
            getState().productReducer.searchedDealsVIACategory;

          let currentProductIndex = currentProducts.findIndex(
            obj => obj.product_id === product_id,
          );
          if (currentProductIndex >= 0) {
            currentProducts[currentProductIndex].mySavedProduct = 'N';
          }

          let currentProductVIACategoryIndex =
            currentProductsVIACategory.findIndex(
              obj => obj.product_id === product_id,
            );
          if (currentProductVIACategoryIndex >= 0) {
            currentProductsVIACategory[
              currentProductVIACategoryIndex
            ].mySavedProduct = 'N';
          }

          dispatch(
            removeProductSuccess({
              updatedProducts: currentProducts,
              updatedProductsVIACategory: currentProductsVIACategory,
            }),
          );
        } else {
          dispatch(removeProductError(res.response.message));
        }
      } else {
        dispatch(removeProductError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(removeProductError(res.response.message));
    } else {
      dispatch(
        removeProductError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const removeProductPending = () => ({
  type: REMOVE_PRODUCT_PENDING,
});

export const removeProductSuccess = res => ({
  type: REMOVE_PRODUCT_SUCCESS,
  payload: res,
});

export const removeProductError = err => ({
  type: REMOVE_PRODUCT_ERROR,
  payload: err,
});

export function getMySavedProducts() {
  return async (dispatch, getState) => {
    let url = `${API.GET_MY_SAVED_PRODUCTS_API}`;
    dispatch(getMySavedProductsPending());

    let body = {};

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          getMySavedProductsSuccess({
            mySavedProducts: !!res.response.data.products
              ? res.response.data.products
              : [],
          }),
        );
      } else {
        dispatch(getMySavedProductsError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(getMySavedProductsError(res.response.message));
    } else {
      dispatch(
        getMySavedProductsError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const getMySavedProductsPending = () => ({
  type: MY_SAVED_PRODUCTS_PENDING,
});

export const getMySavedProductsSuccess = res => ({
  type: MY_SAVED_PRODUCTS_SUCCESS,
  payload: res,
});

export const getMySavedProductsError = err => ({
  type: MY_SAVED_PRODUCTS_ERROR,
  payload: err,
});
