import {
  CLEAR_CART_INFO,
  CONFIRM_ORDER_ERROR,
  CONFIRM_ORDER_PENDING,
  CONFIRM_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  CREATE_ORDER_PENDING,
  CREATE_ORDER_SUCCESS,
  MY_ORDERS_ERROR,
  MY_ORDERS_PENDING,
  MY_ORDERS_SUCCESS,
  REDEEEM_ORDERS_ERROR,
  REDEEEM_ORDERS_PENDING,
  REDEEEM_ORDERS_SUCCESS,
  UPDATE_CART_INFO_PENDING,
  UPDATE_CART_INFO_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  isUpdatingCartInfo: false,
  cartInfoUpdatedSuccessFully: false,
  productsList: [],
  coupon: null,
  totalItems: 0,
  totalUpFront: 0,
  totalRemaining: 0,
  totalPrice: 0,

  isPlacingOrder: false,
  orderPlacedSuccessfully: false,
  orderPlaceError: '',

  isConfirmingOrder: false,
  orderConfirmedSuccessfully: false,
  orderConfirmError: '',

  isFetchingMyOrders: false,
  myOrders: [],
  myOrdersError: '',

  isSubmittingRedeemOrder: false,
  isOrderRedeemed: false,
  redeemOrdersError: '',
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CART_INFO_PENDING: {
      return {
        ...state,

        isUpdatingCartInfo: true,
        cartInfoUpdatedSuccessFully: false,
      };
    }

    case UPDATE_CART_INFO_SUCCESS: {
      return {
        ...state,

        isUpdatingCartInfo: false,
        cartInfoUpdatedSuccessFully: true,
        productsList: action.payload.productsList,
        coupon: action.payload.coupon,
        totalItems: action.payload.totalItems,
        totalUpFront: action.payload.totalUpFront,
        totalRemaining: action.payload.totalRemaining,
        totalPrice: action.payload.totalPrice,
      };
    }

    case CREATE_ORDER_PENDING: {
      return {
        ...state,

        isPlacingOrder: true,
        orderPlacedSuccessfully: false,
        orderPlaceError: '',
      };
    }

    case CREATE_ORDER_SUCCESS: {
      return {
        ...state,

        isPlacingOrder: false,
        orderPlacedSuccessfully: true,
      };
    }

    case CREATE_ORDER_ERROR: {
      return {
        ...state,

        isPlacingOrder: false,
        orderPlaceError: action.payload,
      };
    }

    case CONFIRM_ORDER_PENDING: {
      return {
        ...state,

        isConfirmingOrder: true,
        orderConfirmedSuccessfully: false,
        orderConfirmError: '',
      };
    }

    case CONFIRM_ORDER_SUCCESS: {
      return {
        ...state,

        isConfirmingOrder: false,
        orderConfirmedSuccessfully: true,
      };
    }

    case CONFIRM_ORDER_ERROR: {
      return {
        ...state,

        isConfirmingOrder: false,
        orderConfirmError: action.payload,
      };
    }

    case MY_ORDERS_PENDING: {
      return {
        ...state,

        isFetchingMyOrders: true,
        myOrders: [],
        myOrdersError: '',
      };
    }

    case MY_ORDERS_SUCCESS: {
      return {
        ...state,

        isFetchingMyOrders: false,
        myOrders: action.payload.myOrders,
      };
    }

    case MY_ORDERS_ERROR: {
      return {
        ...state,

        isFetchingMyOrders: false,
        myOrdersError: action.payload,
      };
    }

    case REDEEEM_ORDERS_PENDING: {
      return {
        ...state,

        isSubmittingRedeemOrder: true,
        isOrderRedeemed: false,
        redeemOrdersError: '',
      };
    }

    case REDEEEM_ORDERS_SUCCESS: {
      return {
        ...state,

        isSubmittingRedeemOrder: false,
        isOrderRedeemed: true,
      };
    }

    case REDEEEM_ORDERS_ERROR: {
      return {
        ...state,

        isSubmittingRedeemOrder: false,
        redeemOrdersError: action.payload,
      };
    }

    case CLEAR_CART_INFO: {
      return {
        ...initialState,
      };
    }

    // case LOGOUT: {
    //   return {
    //     ...initialState,
    //   };
    // }

    default:
      return state;
  }
}
