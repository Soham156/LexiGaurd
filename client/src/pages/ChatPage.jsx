import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Settings, 
  MoreVertical, 
  FileText, 
  User, 
  Bot, 
  Upload,
  Zap,
  Shield,
  BarChart3,
  Download,
  Sparkles,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  MessageSquare,
  Clock,
  Search,
  Filter,
  Plus,
  Bookmark,
  Share,
  Copy,
  Trash2,
  Edit3
} from 'lucide-react';

const ChatPage = () => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI legal assistant. I can help you analyze contracts, assess risks, check compliance, and provide legal insights. How can I assist you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Sample chat history
  const chatHistory = [
    { id: 'current', name: 'Current Chat', lastMessage: 'Hello! I\'m your AI legal assistant...', timestamp: new Date(), unread: 0 },
    { id: 'contract-review', name: 'Contract Review', lastMessage: 'The liability clause needs attention...', timestamp: new Date(Date.now() - 1000 * 60 * 30), unread: 2 },
    { id: 'compliance-check', name: 'Compliance Analysis', lastMessage: 'GDPR requirements are met...', timestamp: new Date(Date.now() - 1000 * 60 * 60), unread: 0 },
    { id: 'risk-assessment', name: 'Risk Assessment', lastMessage: 'Medium risk factors identified...', timestamp: new Date(Date.now() - 1000 * 60 * 120), unread: 1 },
  ];

  const quickPrompts = [
    { text: "Analyze contract risks", icon: AlertTriangle, color: "from-red-500 to-orange-500" },
    { text: "Check compliance requirements", icon: Shield, color: "from-green-500 to-emerald-500" },
    { text: "Summarize key terms", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { text: "Generate report", icon: BarChart3, color: "from-purple-500 to-pink-500" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'I understand your request. Let me analyze that for you and provide detailed insights based on legal best practices and compliance requirements.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex">
      {/* Chat Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Chat</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedChat === chat.id ? 'bg-purple-50 dark:bg-purple-900/20 border-r-2 border-r-purple-500' : ''
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {chat.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">
                    {chat.lastMessage}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                    {chat.unread}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Legal AI Assistant</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                  <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to AI Legal Assistant
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                I can help you analyze contracts, assess risks, check compliance, and provide legal insights.
              </p>
              
              {/* Quick Prompts */}
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className={`p-4 bg-gradient-to-r ${prompt.color} text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-3`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <prompt.icon className="w-5 h-5" />
                    <span className="font-medium">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-3 rounded-xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className={`text-sm leading-relaxed ${
                    message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.type === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.type === 'bot' && (
                      <div className="flex items-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                        >
                          <Bookmark className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                        >
                          <Share className="w-3 h-3" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about legal documents, contracts, or compliance..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Quick actions:</span>
            {quickPrompts.slice(0, 2).map((prompt, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {prompt.text}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;