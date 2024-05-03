import { combineReducers } from 'redux';
import authReducer from './authReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';


const rootReducer = combineReducers({
    authReducer,
    productReducer,
    cartReducer
})

export default rootReducer