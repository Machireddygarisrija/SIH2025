import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import matchingSlice from './slices/matchingSlice';
import notificationSlice from './slices/notificationSlice';
import chatbotSlice from './slices/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    matching: matchingSlice,
    notifications: notificationSlice,
    chatbot: chatbotSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;