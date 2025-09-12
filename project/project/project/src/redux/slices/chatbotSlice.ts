import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  loading: boolean;
}

const initialState: ChatbotState = {
  isOpen: false,
  messages: [
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you with the PM Internship Scheme today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ],
  loading: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const message: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      state.messages.push(message);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [state.messages[0]]; // Keep welcome message
    },
  },
});

export const { toggleChatbot, addMessage, setLoading, clearMessages } = chatbotSlice.actions;
export default chatbotSlice.reducer;