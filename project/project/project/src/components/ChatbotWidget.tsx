import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { toggleChatbot, addMessage, setLoading } from '../redux/slices/chatbotSlice';

export default function ChatbotWidget() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, messages, loading } = useSelector((state: RootState) => state.chatbot);
  const { user } = useSelector((state: RootState) => state.auth);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');

    // Add user message
    dispatch(addMessage({ text: userMessage, sender: 'user' }));
    dispatch(setLoading(true));

    try {
      // Simulate AI response based on user role and message
      setTimeout(() => {
        let botResponse = '';
        const lowerMessage = userMessage.toLowerCase();

        if (user?.role === 'applicant') {
          if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
            botResponse = 'To apply for internships: 1) Complete your profile with skills and documents 2) Browse recommended opportunities 3) Click "Apply" on matching positions. The AI will show you the best matches based on your profile!';
          } else if (lowerMessage.includes('profile') || lowerMessage.includes('complete')) {
            botResponse = 'Complete your profile by: 1) Adding your skills and qualifications 2) Uploading required documents (marks memo, PAN, Aadhaar) 3) Setting location preferences. A complete profile gets 10x more matches!';
          } else if (lowerMessage.includes('mentor') || lowerMessage.includes('guidance')) {
            botResponse = 'Connect with mentors by: 1) Going to "Mentors" tab 2) Browse matched industry experts 3) Send connection requests. Mentors can guide your career path and interview preparation!';
          } else {
            botResponse = 'I can help you with applications, profile completion, mentor connections, and career guidance. What would you like to know about?';
          }
        } else if (user?.role === 'recruiter') {
          if (lowerMessage.includes('post') || lowerMessage.includes('opportunity')) {
            botResponse = 'To post opportunities: 1) Go to "Post Opportunity" 2) Fill in job details, skills required, location 3) Set slots and requirements. Our AI will automatically match qualified candidates!';
          } else if (lowerMessage.includes('candidates') || lowerMessage.includes('applicants')) {
            botResponse = 'View matched candidates in your dashboard. Use filters for skills, location, experience. Each candidate has an AI-generated match score and explanation!';
          } else {
            botResponse = 'I can help with posting opportunities, reviewing candidates, managing applications, and compliance requirements. What do you need assistance with?';
          }
        } else if (user?.role === 'mentor') {
          if (lowerMessage.includes('mentee') || lowerMessage.includes('student')) {
            botResponse = 'Your matched mentees appear in the "My Mentees" section. You can: 1) Schedule video calls 2) Share career tips 3) Track their progress 4) Provide feedback on applications.';
          } else if (lowerMessage.includes('tips') || lowerMessage.includes('advice')) {
            botResponse = 'Share tips in the community forum or directly with mentees. Popular topics include: resume writing, interview skills, technical preparation, and career planning.';
          } else {
            botResponse = 'I can help with mentee management, sharing career guidance, scheduling sessions, and tracking mentee progress. How can I assist you?';
          }
        } else if (user?.role === 'admin') {
          if (lowerMessage.includes('matching') || lowerMessage.includes('algorithm')) {
            botResponse = 'Run the matching engine from the Admin Dashboard. Monitor progress, view fairness metrics, and generate compliance reports. The AI considers skills, location, quotas, and preferences.';
          } else if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
            botResponse = 'Generate reports from Analytics section: 1) Matching success rates 2) Diversity metrics 3) Geographic distribution 4) User engagement stats. Export as PDF or CSV.';
          } else {
            botResponse = 'I can help with user management, running matching algorithms, generating reports, system monitoring, and compliance oversight. What admin task do you need help with?';
          }
        } else {
          botResponse = 'Welcome to the PM Internship Portal! I can help you with registration, understanding the platform, and navigating different features. How can I assist you today?';
        }

        dispatch(addMessage({ text: botResponse, sender: 'bot' }));
        dispatch(setLoading(false));
      }, 1500);
    } catch (error) {
      dispatch(addMessage({ text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }));
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleChatbot())}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 flex items-center justify-center transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
        
        {/* Notification dot for new messages */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col overflow-hidden border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-90">PM Internship Helper</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleChatbot())}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}