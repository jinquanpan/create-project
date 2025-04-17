import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认 localStorage
import reducers from '@/store'

const persistConfig = {
  // 存储的 key
  key: 'root',
  // 存储方式 localStorage
  storage,
};

// 创建持久化 reducer
const persistedReducer = persistReducer(persistConfig, combineReducers(reducers));

// 创建 Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查
    }),
});

// 创建 persistor
const persistor = persistStore(store);

export default {
  store,
  persistor
}