import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Paperclip,
  Smile,
  FileText,
  User,
  Bot,
  MessageSquare,
} from 'lucide-react';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI legal assistant. I can help you understand contract clauses, identify risks, and answer questions about your documents. How can I assist you today?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 2,
      type: 'user',
      content: 'Can you explain the termination clause in my employment agreement?',
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: 3,
      type: 'bot',
      content: 'I\'d be happy to help explain the termination clause. Based on your employment agreement, the termination clause typically covers:\n\n• Notice period requirements\n• Conditions for termination with or without cause\n• Severance pay obligations\n• Return of company property\n\nWould you like me to analyze any specific aspect of your termination clause?',
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: 4,
      type: 'user',
      content: 'What about the non-compete section?',
      timestamp: new Date(Date.now() - 15000),
    },
    {
      id: 5,
      type: 'bot',
      content: 'The non-compete clause in your agreement restricts your ability to work for competitors for a specified period after leaving the company. Key points to consider:\n\n⚠️ **Duration**: 12 months (this is reasonable in most jurisdictions)\n⚠️ **Geographic scope**: Worldwide (this may be overly broad)\n⚠️ **Industry scope**: Technology sector\n\n**Risk Assessment**: MEDIUM - The worldwide scope could be challenged in court. Consider negotiating a more specific geographic limitation.',
      timestamp: new Date(Date.now() - 5000),
    },
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I understand your question. Let me analyze that for you and provide a detailed explanation based on legal best practices and your document context.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message: msg }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {msg.type === 'bot' && (
        <div className="flex-shrink-0 w-8 h-8 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'order-1' : ''}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            msg.type === 'user'
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className={`text-xs text-sky-500 dark:text-gray-400 mt-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
          {formatTime(msg.timestamp)}
        </p>
      </div>

      {msg.type === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center order-2">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="h-full flex gap-6">
      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 dark:bg-sky-900/50 rounded-full">
              <MessageSquare className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sky-900 dark:text-white">Document Chat</h1>
              <p className="text-sm text-sky-600 dark:text-gray-400">Ask questions about your legal documents</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-sky-25 dark:bg-gray-900/50">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {[
              'Explain this clause',
              'What are the risks?',
              'Is this normal?',
              'Suggest improvements',
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="flex-shrink-0 px-3 py-1 text-sm bg-sky-50 dark:bg-gray-700 text-sky-600 dark:text-sky-400 rounded-full hover:bg-sky-100 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask a question about your documents..."
                className="w-full px-4 py-3 pr-12 border border-sky-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="1"
              />
              <div className="absolute right-3 top-3 flex gap-2">
                <button className="text-sky-400 hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-400">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-sky-400 hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-400">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-3 rounded-2xl transition-colors ${
                message.trim()
                  ? 'bg-sky-600 text-white hover:bg-sky-700'
                  : 'bg-sky-100 dark:bg-gray-600 text-sky-400 dark:text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Document Context Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:block w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-sky-100 dark:border-gray-700 p-4"
      >
        <h3 className="font-semibold text-sky-900 dark:text-white mb-3">Current Document</h3>
        <div className="flex items-center gap-3 p-3 bg-sky-50 dark:bg-gray-700 rounded-lg">
          <FileText className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="font-medium text-sky-900 dark:text-white">Employment Agreement</p>
            <p className="text-sm text-sky-600 dark:text-gray-400">John Doe - Tech Corp</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-sky-600 dark:text-gray-400">Total Clauses:</span>
            <span className="font-medium text-sky-900 dark:text-white">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sky-600 dark:text-gray-400">Risk Level:</span>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
              Medium
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sky-600 dark:text-gray-400">Status:</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Reviewed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage;