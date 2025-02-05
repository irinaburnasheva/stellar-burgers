import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userSliceReducer from './slices/userSlice';
import feedSliceReducer from './slices/feedSlice';
import ingredientsSliceReducer from './slices/ingredientsSlice';
import orderConstructorSliceReducer from './slices/orderConstructorSlice';

export const rootReducer = combineReducers({
  user: userSliceReducer,
  feed: feedSliceReducer,
  ingredients: ingredientsSliceReducer,
  orderСonstructor: orderConstructorSliceReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
