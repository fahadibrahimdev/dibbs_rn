import {API} from '../../constants/APIs';
import {strings} from '../../constants/Localization';
import {CartUpdateActionEnum, PaymentMethodsEnum} from '../../helpers/enum';
import {POST} from '../../helpers/helperFunctions';
import {stringToNumber} from '../../helpers/Util';
import {
  CLEAR_CART_INFO,
  CONFIRM_ORDER_ERROR,
  CONFIRM_ORDER_PENDING,
  CONFIRM_ORDER_SUCCESS,
  CREATE_ORDER_ERROR,
  CREATE_ORDER_PENDING,
  CREATE_ORDER_SUCCESS,
  DO_STRIPE_PAYMENT_ERROR,
  DO_STRIPE_PAYMENT_IDLE,
  DO_STRIPE_PAYMENT_PENDING,
  DO_STRIPE_PAYMENT_SUCCESS,
  MY_ORDERS_ERROR,
  MY_ORDERS_PENDING,
  MY_ORDERS_SUCCESS,
  REDEEEM_ORDERS_ERROR,
  REDEEEM_ORDERS_PENDING,
  REDEEEM_ORDERS_SUCCESS,
  SAVE_CART_INFO_ERROR,
  SAVE_CART_INFO_PENDING,
  SAVE_CART_INFO_SUCCESS,
  UPDATE_CART_INFO_PENDING,
  UPDATE_CART_INFO_SUCCESS,
} from './actionTypes';

export function saveCartInfo() {
  return async (dispatch, getState) => {
    const userToken = getState().authReducer.userInfo.token;

    let url = `${API.SEARCH_PRODUCTS_WITHOUT_TOKEN_API}`;

    dispatch(saveCartInfoPending());

    let body = {
      keywords: '',
      start: 0,
      rows: 20,
    };

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        setTimeout(() => {
          dispatch(
            saveCartInfoSuccess({
              searchedDeals: res.response.data.products,
            }),
          );
        }, 500 * 1);
      } else {
        setTimeout(() => {
          dispatch(saveCartInfoError(res.response.message));
        }, 500 * 1);
      }
    } else if (response.status === 422) {
      let res = await response.json();

      setTimeout(() => {
        dispatch(saveCartInfoError(res.response.message));
      }, 500 * 1);
    } else {
      setTimeout(() => {
        dispatch(
          saveCartInfoError(
            !!response.message ? response.message : strings.networkError,
          ),
        );
      }, 500 * 1);
    }
  };
}

export const saveCartInfoPending = () => ({
  type: SAVE_CART_INFO_PENDING,
});

export const saveCartInfoSuccess = res => ({
  type: SAVE_CART_INFO_SUCCESS,
  payload: res,
});

export const saveCartInfoError = err => ({
  type: SAVE_CART_INFO_ERROR,
  payload: err,
});

export function addRemoveProductInCart(
  productVariation,
  productDetails = null,
  action = CartUpdateActionEnum.Add,
  newCouponCode = '',
) {
  return async (dispatch, getState) => {
    dispatch(updateCartInfoPending());

    const reducerState = getState().cartReducer;

    var oldProductsList = reducerState.productsList;
    var coupon = reducerState.coupon;
    var totalItems = reducerState.totalItems;
    var totalUpFront = reducerState.totalUpFront;
    var totalRemaining = reducerState.totalRemaining;
    var totalPrice = reducerState.totalPrice;

    var isNewProduct = true;

    var filteredData = [];

    const updatedProducts = oldProductsList.map(item => {
      if (productVariation.auto_id === item.auto_id) {
        isNewProduct = false;

        if (action === CartUpdateActionEnum.Add) {
          item.currentCount = (!!item.currentCount ? item.currentCount : 0) + 1;
        } else {
          item.currentCount = (!!item.currentCount ? item.currentCount : 0) - 1;
        }
        return item;
      } else {
        item.currentCount = !!item.currentCount ? item.currentCount : 0;
        return item;
      }
    });

    if (action === CartUpdateActionEnum.Add) {
      if (isNewProduct) {
        console.log('New product');
        updatedProducts.push({
          ...productVariation,
          productDetails: productDetails,
          currentCount: 1,
        });
      } else {
        console.log('Old product');
      }
    } else {
      if (isNewProduct) {
        console.log('New product');
      } else {
        console.log('Old product');
        filteredData = updatedProducts.filter(item => {
          if (item.currentCount === 0) {
            return false;
          } else {
            return true;
          }
        });
      }
    }

    var mPrice = stringToNumber(productVariation.price);
    var mDiscount = stringToNumber(productVariation.discount);
    var mOwnerShare = stringToNumber(productDetails.owner_share);
    var mFactor;
    var itemIncreasedOrDecreased;

    if (action === CartUpdateActionEnum.Add) {
      mFactor = 1;
      itemIncreasedOrDecreased = 1;
    } else {
      mFactor = -1;
      itemIncreasedOrDecreased = -1;
    }

    let newPrice = (mPrice - mDiscount) * mFactor;
    let newTotalPrice = totalPrice + newPrice;

    let newUpfront = (newPrice * mOwnerShare) / 100;
    let newTotalUpFront = totalUpFront + newUpfront;
    let newTotalRemaining = newTotalPrice - newTotalUpFront;

    let res = {
      productsList:
        action === CartUpdateActionEnum.Remove && isNewProduct === false
          ? filteredData
          : updatedProducts,
      coupon: !!newCouponCode ? newCouponCode : coupon,
      totalItems: totalItems + itemIncreasedOrDecreased,
      totalUpFront: newTotalUpFront,
      totalRemaining: newTotalRemaining,
      totalPrice: newTotalPrice,
    };

    dispatch(updateCartInfoSuccess(res));
  };
}

export const updateCartInfoPending = () => ({
  type: UPDATE_CART_INFO_PENDING,
});

export const updateCartInfoSuccess = res => ({
  type: UPDATE_CART_INFO_SUCCESS,
  payload: res,
});

export function createOrder(coupon, method, transactionInfo, dibbs_credit) {
  return async (dispatch, getState) => {
    const reducerState = getState().cartReducer;
    const productReducer = getState().productReducer;

    var dibbsCredits = productReducer.dibbsCredits;
    var allCoupons = productReducer.allCoupons;
    var appliedCoupon = null;

    var couponAmount = 0;
    var isCouponApplied = false;

    allCoupons.map(item => {
      if (item.code === coupon) {
        appliedCoupon = item;
      }
    });

    if (!!appliedCoupon) {
      couponAmount = appliedCoupon.discount;
      isCouponApplied = true;
    }

    let url = `${API.CREATE_ORDER_API}`;
    dispatch(createOrderPending());

    var product_list = [];

    reducerState.productsList.map(obj => {
      var mOwnerShare = stringToNumber(obj.productDetails.owner_share);
      var mProductID = stringToNumber(obj.productDetails.product_id);
      var mVariationId = stringToNumber(obj.auto_id);

      for (let i = 0; i < obj.currentCount; i++) {
        product_list.push({
          product_id: mProductID,
          variation_id: mVariationId,
          quantity: 1,
          unit_price: obj.price - obj.discount,
          // total_price: obj.currentCount * (obj.price - obj.discount),
          total_price: obj.price - obj.discount,
          // owner_amount:
          //   (obj.currentCount * (obj.price - obj.discount) * mOwnerShare) / 100,
          owner_amount: isCouponApplied
            ? (((obj.price - obj.discount) * mOwnerShare) / 100) *
              ((100 - parseFloat(couponAmount)) / 100)
            : ((obj.price - obj.discount) * mOwnerShare) / 100,
        });
      }

      // return {
      //   product_id: mProductID,
      //   variation_id: mVariationId,
      //   quantity: obj.currentCount,
      //   unit_price: obj.price - obj.discount,
      //   total_price: obj.currentCount * (obj.price - obj.discount),
      //   owner_amount:
      //     (obj.currentCount * (obj.price - obj.discount) * mOwnerShare) / 100,
      // };
    });

    var totalUpFront = isCouponApplied
      ? reducerState.totalUpFront.toFixed(2) -
        reducerState.totalUpFront * (parseFloat(couponAmount) / 100).toFixed(2)
      : reducerState.totalUpFront;

    let body = {
      product_list: product_list,
      total_price: reducerState.totalPrice,
      owner_amount: totalUpFront,
      is_coupon_applied: isCouponApplied,
      coupon: coupon,
      coupon_number: coupon,
      coupon_percentage: couponAmount,
      paymentMethod: method,
      stripe_token:
        !!transactionInfo && !!transactionInfo.id ? transactionInfo.id : 0,
      dibbs_credit: dibbsCredits,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        if (method === PaymentMethodsEnum.Stripe && totalUpFront !== 0) {
          dispatch(
            confirmOrder(res.response.data, totalUpFront, transactionInfo.id),
          );
        }

        dispatch(
          createOrderSuccess({
            status: true,
          }),
        );
      } else {
        dispatch(createOrderError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(createOrderError(res.response.message));
    } else {
      dispatch(
        createOrderError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const createOrderPending = () => ({
  type: CREATE_ORDER_PENDING,
});

export const createOrderSuccess = res => ({
  type: CREATE_ORDER_SUCCESS,
  payload: res,
});

export const createOrderError = err => ({
  type: CREATE_ORDER_ERROR,
  payload: err,
});

export function confirmOrder(orderId, amount, stripeTransactionId) {
  return async (dispatch, getState) => {
    let url = `${API.CONFIRM_ORDER_API}`;
    dispatch(confirmOrderPending());

    const productReducer = getState().productReducer;

    var dibbsCredits = productReducer.dibbsCredits;

    let body = {
      order_id: orderId,
      amount: amount * 100,
      method: stripeTransactionId,
      dibbs_credit: dibbsCredits,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          confirmOrderSuccess({
            status: true,
          }),
        );
      } else {
        dispatch(confirmOrderError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(confirmOrderError(res.response.message));
    } else {
      dispatch(
        confirmOrderError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const confirmOrderPending = () => ({
  type: CONFIRM_ORDER_PENDING,
});

export const confirmOrderSuccess = res => ({
  type: CONFIRM_ORDER_SUCCESS,
  payload: res,
});

export const confirmOrderError = err => ({
  type: CONFIRM_ORDER_ERROR,
  payload: err,
});

export function getMyOrders() {
  return async (dispatch, getState) => {
    let url = `${API.GET_MY_ORDERS_API}`;
    dispatch(getMyOrdersPending());

    let body = {
      status: '',
      start: 0,
      rows: 20,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(
          getMyOrdersSuccess({
            myOrders: !!res.response.data.orders
              ? res.response.data.orders
              : [],
          }),
        );
      } else {
        dispatch(getMyOrdersError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(getMyOrdersError(res.response.message));
    } else {
      dispatch(
        getMyOrdersError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const getMyOrdersPending = () => ({
  type: MY_ORDERS_PENDING,
});

export const getMyOrdersSuccess = res => ({
  type: MY_ORDERS_SUCCESS,
  payload: res,
});

export const getMyOrdersError = err => ({
  type: MY_ORDERS_ERROR,
  payload: err,
});

export const clearCartInfo = () => ({
  type: CLEAR_CART_INFO,
});

export function redeemOrder(orderId, redeemCode) {
  return async (dispatch, getState) => {
    let url = `${API.REDEEM_ORDERS_API}`;
    dispatch(redeemOrderPending());

    let body = {
      order_id: orderId,
      redeem_code: redeemCode,
    };

    const userToken = getState().authReducer.userInfo.token;

    let response = await POST(url, body, userToken);

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.response.status === 'Y') {
        dispatch(redeemOrderSuccess({}));
      } else {
        dispatch(redeemOrderError(res.response.message));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(redeemOrderError(res.response.message));
    } else {
      dispatch(
        redeemOrderError(
          !!response.message ? response.message : strings.networkError,
        ),
      );
    }
  };
}

export const redeemOrderPending = () => ({
  type: REDEEEM_ORDERS_PENDING,
});

export const redeemOrderSuccess = () => ({
  type: REDEEEM_ORDERS_SUCCESS,
});

export const redeemOrderError = err => ({
  type: REDEEEM_ORDERS_ERROR,
  payload: err,
});

export function doStripePayment(amount, currency, paymentMethodId) {
  return async (dispatch, getState) => {
    let url = `${API.STRIPE_PAYMENT_API}`;
    dispatch(doStripePaymentPending());

    const reducerState = getState().cartReducer;
    const productReducer = getState().productReducer;

    var allCoupons = productReducer.allCoupons;
    var appliedCoupon = null;
    var coupon = reducerState.coupon;
    var couponAmount = 0;
    var isCouponApplied = false;

    allCoupons.map(obj => {
      console.log('Fahad map obj: ', obj);
      if (obj.code === coupon) {
        appliedCoupon = obj;
      }
    });

    if (!!appliedCoupon) {
      couponAmount = appliedCoupon.discount;
      isCouponApplied = true;
    }

    var totalUpFront = isCouponApplied
      ? reducerState.totalUpFront.toFixed(2) -
        reducerState.totalUpFront * (parseFloat(couponAmount) / 100).toFixed(2)
      : reducerState.totalUpFront;

    let shifted = totalUpFront * 100;

    // Truncate the decimal part
    let totalUpFrontInInteger = Math.trunc(shifted);

    console.log('Fahad total amount paid: ', totalUpFront);
    let body = {
      amount: totalUpFrontInInteger,
      currency: currency,
      paymentMethodId: paymentMethodId,
    };

    // const userToken = getState().authReducer.userInfo.token;

    console.log('Fahad api vercel body: ', body);

    let response = await POST(url, body, '');

    if (response.status >= 200 && response.status < 300) {
      let res = await response.json();

      if (res.status === true) {
        dispatch(
          doStripePaymentSuccess({
            payload: res.data,
          }),
        );
      } else {
        dispatch(doStripePaymentError({error: res.response.message}));
      }
    } else if (response.status === 422) {
      let res = await response.json();
      dispatch(doStripePaymentError({error: res.response.message}));
    } else {
      dispatch(
        doStripePaymentError({
          error: !!response.message ? response.message : strings.networkError,
        }),
      );
    }
  };
}

export const doStripePaymentIdle = () => ({
  type: DO_STRIPE_PAYMENT_IDLE,
});

export const doStripePaymentPending = () => ({
  type: DO_STRIPE_PAYMENT_PENDING,
});

export const doStripePaymentSuccess = payload => ({
  type: DO_STRIPE_PAYMENT_SUCCESS,
  payload: payload,
});

export const doStripePaymentError = err => ({
  type: DO_STRIPE_PAYMENT_ERROR,
  payload: err,
});
