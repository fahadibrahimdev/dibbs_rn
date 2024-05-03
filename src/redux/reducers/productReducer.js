import {CALL_STATE} from '../../helpers/enum';
import {
  CLEAR_GET_CATEGORIES_INFO,
  CLEAR_SEARCH_PRODUCTS,
  GET_CATEGORIES_INFO_ERROR,
  GET_CATEGORIES_INFO_IDLE,
  GET_CATEGORIES_INFO_PENDING,
  GET_CATEGORIES_INFO_SUCCESS,
  LOGOUT,
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
  SEARCH_DEALS_VIA_CATEGORY_ERROR,
  SEARCH_DEALS_VIA_CATEGORY_PENDING,
  SEARCH_DEALS_VIA_CATEGORY_SUCCESS,
  SEARCH_PRODUCTS_ERROR,
  SEARCH_PRODUCTS_PENDING,
  SEARCH_PRODUCTS_SUCCESS,
  SET_REFERRAL_CODE,
} from '../actions/actionTypes';

const initialState = {
  isSearchingDeals: false,
  allDealsFetched: false,

  allCoupons: [],
  couponAmount: 0,
  couponCode: '',
  searchedDeals: [],
  searchDealsError: '',
  referralCode: '',
  dibbsCredits: 0,
  appUrl: '',

  isSearchingVIACategoryDeals: false,
  allDealsVIACategoryFetched: false,

  allCouponsVIACategory: [],
  couponAmountVIACategory: 0,
  couponCodeVIACategory: '',
  searchedDealsVIACategory: [],
  searchDealsErrorVIACategory: '',
  dibbsCreditsVIACategory: 0,
  appUrlVIACategory: '',

  isSearchingProducts: false,
  productsSearchedSuccessfully: false,
  allProductsFetched: false,
  searchedProducts: [],
  searchProdductsError: '',

  isSavingProduct: false,
  productSavedSuccessfully: false,
  productSaveError: '',

  isDeletingProduct: false,
  productDeletedSuccessfully: false,
  productDeleteError: '',

  isFetchingMySavedProducts: false,
  mySavedProducts: [],
  mySavedProductsError: '',

  appCategoriesRedux: {
    state: CALL_STATE.IDLE,
    payload: [],
    error: '',
  },
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_DEALS_PENDING: {
      return {
        ...state,

        isSearchingDeals: true,
        allDealsFetched: false,
        searchDealsError: '',
      };
    }

    case SEARCH_DEALS_SUCCESS: {
      return {
        ...state,

        isSearchingDeals: false,
        couponAmount: action.payload.couponAmount,
        allCoupons: !!action.payload.allCoupons
          ? action.payload.allCoupons
          : [],
        couponCode: action.payload.couponCode,
        dibbsCredits: action.payload.dibbsCredits,
        appUrl: action.payload.appUrl,
        allDealsFetched: action.payload.allDealsFetched,
        searchedDeals: action.payload.searchedDeals,
      };
    }

    case SEARCH_DEALS_ERROR: {
      return {
        ...state,

        isSearchingDeals: false,
        searchDealsError: action.payload,
      };
    }

    case SEARCH_DEALS_VIA_CATEGORY_PENDING: {
      return {
        ...state,

        isSearchingVIACategoryDeals: true,
        allDealsVIACategoryFetched: false,
        searchedDealsVIACategory: [],
        searchDealsErrorVIACategory: '',
      };
    }

    case SEARCH_DEALS_VIA_CATEGORY_SUCCESS: {
      return {
        ...state,

        isSearchingVIACategoryDeals: false,
        couponAmountVIACategory: action.payload.couponAmount,
        allCouponsVIACategory: !!action.payload.allCoupons
          ? action.payload.allCoupons
          : [],
        couponCodeVIACategory: action.payload.couponCode,
        dibbsCreditsVIACategory: action.payload.dibbsCredits,
        appUrlVIACategory: action.payload.appUrl,
        allDealsVIACategoryFetched: action.payload.allDealsFetched,
        searchedDealsVIACategory: action.payload.searchedDeals,
      };
    }

    case SEARCH_DEALS_VIA_CATEGORY_ERROR: {
      return {
        ...state,

        isSearchingVIACategoryDeals: false,
        searchDealsErrorVIACategory: action.payload,
      };
    }

    case SEARCH_PRODUCTS_PENDING: {
      return {
        ...state,

        isSearchingProducts: true,
        productsSearchedSuccessfully: false,
        allProductsFetched: false,
        searchedProducts: [],
        searchProdductsError: '',
      };
    }

    case SEARCH_PRODUCTS_SUCCESS: {
      return {
        ...state,

        isSearchingProducts: false,
        productsSearchedSuccessfully: true,
        allProductsFetched: action.payload.allProductsFetched,
        searchedProducts: action.payload.searchedProducts,
      };
    }

    case SEARCH_PRODUCTS_ERROR: {
      return {
        ...state,

        isSearchingProducts: false,
        productsSearchedSuccessfully:
          action.payload.productsSearchedSuccessfully,
        searchProdductsError: action.payload.error,
      };
    }

    case CLEAR_SEARCH_PRODUCTS: {
      return {
        ...state,

        isSearchingProducts: false,
        productsSearchedSuccessfully: false,
        allProductsFetched: false,
        searchedProducts: [],
        searchProdductsError: '',
      };
    }

    case GET_CATEGORIES_INFO_IDLE: {
      let oldAppCategoriesRedux = state.appCategoriesRedux;
      return {
        ...state,

        appCategoriesRedux: {
          state: CALL_STATE.IDLE,

          payload: oldAppCategoriesRedux.payload,

          error: oldAppCategoriesRedux.error,
        },
      };
    }

    case GET_CATEGORIES_INFO_PENDING: {
      let oldAppCategoriesRedux = state.appCategoriesRedux;
      return {
        ...state,

        appCategoriesRedux: {
          state: CALL_STATE.FETCHING,

          payload: oldAppCategoriesRedux.payload,

          error: oldAppCategoriesRedux.error,
        },
      };
    }

    case GET_CATEGORIES_INFO_SUCCESS: {
      let oldAppCategoriesRedux = state.appCategoriesRedux;
      return {
        ...state,

        appCategoriesRedux: {
          state: CALL_STATE.SUCCESS,

          payload: action.payload.data,

          error: oldAppCategoriesRedux.error,
        },
      };
    }

    case GET_CATEGORIES_INFO_ERROR: {
      let oldAppCategoriesRedux = state.appCategoriesRedux;
      return {
        ...state,

        appCategoriesRedux: {
          state: CALL_STATE.ERROR,

          payload: oldAppCategoriesRedux.payload,

          error: action.payload.error,
        },
      };
    }

    case CLEAR_GET_CATEGORIES_INFO: {
      let oldAppCategoriesRedux = state.appCategoriesRedux;
      return {
        ...state,

        appCategoriesRedux: {
          state: CALL_STATE.IDLE,

          payload: [],

          error: '',
        },
      };
    }

    case SAVE_PRODUCT_PENDING: {
      return {
        ...state,

        isSavingProduct: true,
        productSavedSuccessfully: false,
        productSaveError: '',
      };
    }

    case SAVE_PRODUCT_SUCCESS: {
      return {
        ...state,

        isSavingProduct: false,
        productSavedSuccessfully: true,
        searchedDeals: action.payload.updatedProducts,
        searchedDealsVIACategory: action.payload.updatedProductsVIACategory,
      };
    }

    case SAVE_PRODUCT_ERROR: {
      return {
        ...state,

        isSavingProduct: false,
        productSaveError: action.payload,
      };
    }

    case REMOVE_PRODUCT_PENDING: {
      return {
        ...state,

        isDeletingProduct: true,
        productDeletedSuccessfully: false,
        productDeleteError: '',
      };
    }

    case REMOVE_PRODUCT_SUCCESS: {
      return {
        ...state,

        isDeletingProduct: false,
        productDeletedSuccessfully: true,
        searchedDeals: action.payload.updatedProducts,
        searchedDealsVIACategory: action.payload.updatedProductsVIACategory,
      };
    }

    case REMOVE_PRODUCT_ERROR: {
      return {
        ...state,

        isDeletingProduct: false,
        productDeleteError: action.payload,
      };
    }

    case MY_SAVED_PRODUCTS_PENDING: {
      return {
        ...state,

        isFetchingMySavedProducts: true,
        mySavedProducts: [],
        mySavedProductsError: '',
      };
    }

    case MY_SAVED_PRODUCTS_SUCCESS: {
      return {
        ...state,

        isFetchingMySavedProducts: false,
        mySavedProducts: action.payload.mySavedProducts,
      };
    }

    case MY_SAVED_PRODUCTS_ERROR: {
      return {
        ...state,

        isFetchingMySavedProducts: false,
        mySavedProductsError: action.payload,
      };
    }

    case SET_REFERRAL_CODE: {
      return {
        ...state,

        referralCode: action.payload.referralCode,
        allCoupons: !!action.payload.coupens ? action.payload.coupens : [],
      };
    }

    case LOGOUT: {
      let isSearchingDeals = state.isSearchingDeals;
      let couponAmount = state.couponAmount;
      let allCoupons = state.allCoupons;
      let couponCode = state.couponCode;
      let dibbsCredits = state.dibbsCredits;
      let appUrl = state.appUrl;
      let allDealsFetched = state.allDealsFetched;
      let searchedDeals = state.searchedDeals;

      return {
        ...initialState,

        isSearchingDeals: isSearchingDeals,
        couponAmount: couponAmount,
        allCoupons: allCoupons,
        couponCode: couponCode,
        dibbsCredits: dibbsCredits,
        appUrl: appUrl,
        allDealsFetched: allDealsFetched,
        searchedDeals: searchedDeals,
      };
    }

    default:
      return state;
  }
}
