import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import aiEvaluation from './features/ai-evaluation.slice';

const persistConfig = {
  key: 'parh-ai',
  storage,
  whitelist: ['aiEvaluation'], // only persist these features
  // whitelist: ['counter'], // only persist these features
};

const rootReducer = combineReducers({
  aiEvaluation: aiEvaluation,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Define a type for the entire state of your Redux store
export type RootState = ReturnType<typeof rootReducer>;

// Define a type for the dispatch function
export type AppDispatch = typeof store.dispatch;

// Create a typed version of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Create a typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);