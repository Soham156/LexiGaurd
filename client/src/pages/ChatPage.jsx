import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Brain,
  Mic,
  Image,
  Plus,
  ChevronDown,
  Search,
  Filter,
  Archive,
  Star,
  Copy,
  Share,
  Trash2,
  Edit3,
  RefreshCw,
  MicOff,
  Square,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

const ChatPage = () => {
  // Custom component for formatting bot messages
  const BotMessage = ({ content, documentContext, responseType }) => {
    // Special handling for What-If scenario responses
    if (responseType === 'scenario_analysis') {
      return (
        <div className="space-y-3 max-w-full overflow-hidden break-words">
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center text-sm text-purple-700 dark:text-purple-300 mb-2">
              <Zap className="h-4 w-4 mr-2" />
              What-If Scenario Analysis
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Advanced predictive analysis based on your contract
            </div>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({children}) => <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center break-words"><Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" /><span className="break-words">{children}</span></h2>,
              h3: ({children}) => <h3 className="text-base font-medium text-purple-700 dark:text-purple-300 mb-2 break-words">{children}</h3>,
              p: ({children}) => <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed break-words">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ol>,
              li: ({children}) => <li className="break-words">{children}</li>,
              strong: ({children}) => <strong className="font-semibold text-purple-800 dark:text-purple-200 break-words">{children}</strong>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-purple-300 dark:border-purple-600 pl-4 py-2 bg-purple-50 dark:bg-purple-900/10 mb-3 break-words">
                  <div className="text-purple-700 dark:text-purple-300 break-words">{children}</div>
                </blockquote>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    // Regular bot messages
    return (
      <div className="space-y-3 max-w-full overflow-hidden break-words">
        {documentContext && (
          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Document Analysis
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
              Based on: {documentContext.fileName}
            </div>
          </div>
        )}
        
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 break-words">{children}</h1>,
            h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 break-words">{children}</h2>,
            h3: ({children}) => <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 break-words">{children}</h3>,
            p: ({children}) => <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed break-words">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 break-words">{children}</ol>,
            li: ({children}) => <li className="break-words">{children}</li>,
            strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white break-words">{children}</strong>,
            code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm break-words">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg overflow-x-auto mb-3 break-words">{children}</pre>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-300 dark:border-blue-600 pl-4 py-2 bg-blue-50 dark:bg-blue-900/10 mb-3 break-words">
                <div className="text-blue-700 dark:text-blue-300 break-words">{children}</div>
              </blockquote>
            ),
            table: ({children}) => (
              <div className="overflow-x-auto mb-3">
                <table className="min-w-full border border-gray-300 dark:border-gray-600 break-words">{children}</table>
              </div>
            ),
            th: ({children}) => <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left break-words">{children}</th>,
            td: ({children}) => <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 break-words">{children}</td>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const quickActions = [
    { name: 'Document Analysis', icon: FileText, color: 'from-blue-500 to-blue-600', description: 'Analyze uploaded documents' },
    { name: 'Risk Assessment', icon: AlertTriangle, color: 'from-red-500 to-red-600', description: 'Identify potential risks' },
    { name: 'Compliance Check', icon: Shield, color: 'from-green-500 to-green-600', description: 'Verify legal compliance' },
    { name: 'Contract Summary', icon: BarChart3, color: 'from-purple-500 to-purple-600', description: 'Generate summaries' },
    { name: 'Clause Extraction', icon: Copy, color: 'from-yellow-500 to-yellow-600', description: 'Extract key clauses' },
    { name: 'What-If Analysis', icon: Zap, color: 'from-indigo-500 to-indigo-600', description: 'Scenario planning' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // State variables
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [userDocuments, setUserDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, complete
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAnalysisStatusText = () => {
    switch (analysisStatus) {
      case 'analyzing': return 'Analyzing...';
      case 'complete': return 'Analysis Complete';
      default: return 'Ready';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `I understand you're asking about: "${inputMessage}"\n\nI'm here to help you with document analysis, legal compliance, and risk assessment. Would you like me to analyze a specific document or provide more information about our capabilities?`,
        timestamp: new Date(),
        documentContext: selectedDocument
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        processAudioToText(audioBlob);
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingDuration(0);
      
      recorder.start();
      
      // Start duration timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Store timer to clear later
      recorder.timer = timer;

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      if (mediaRecorder.timer) {
        clearInterval(mediaRecorder.timer);
      }
      setIsRecording(false);
      
      // Stop all tracks to release the microphone
      mediaRecorder.stream?.getTracks().forEach(track => track.stop());
    }
  };

  const processAudioToText = async (audioBlob) => {
    setIsProcessingAudio(true);
    
    try {
      // Use Web Speech API for speech-to-text
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsProcessingAudio(false);
          
          // Auto-focus the input after transcription
          setTimeout(() => {
            const textarea = document.querySelector('textarea[placeholder*="message"]');
            if (textarea) textarea.focus();
          }, 100);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          let errorMessage = 'Error processing voice input. ';
          
          switch(event.error) {
            case 'no-speech':
              errorMessage += 'No speech detected. Please try again.';
              break;
            case 'network':
              errorMessage += 'Network error. Please check your connection.';
              break;
            case 'not-allowed':
              errorMessage += 'Microphone permission denied.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
          
          alert(errorMessage);
          setIsProcessingAudio(false);
        };

        recognition.onend = () => {
          setIsProcessingAudio(false);
        };

        recognition.start();
      } else {
        // Fallback for browsers without Speech Recognition
        alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
        setIsProcessingAudio(false);
      }
      
    } catch (error) {
      console.error('Error with speech recognition:', error);
      alert('Error accessing speech recognition. Please try again.');
      setIsProcessingAudio(false);
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMessage = {
        id: messages.length + 1,
        type: 'user',
        content: `📎 Uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        timestamp: new Date(),
        isFile: true
      };
      setMessages([...messages, fileMessage]);
      
      setIsTyping(true);
      // Simulate file processing
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          type: 'bot',
          content: `I've received your file "${file.name}". I'm now analyzing the document for key information, potential risks, and compliance issues. This may take a few moments.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleQuickAction = async (actionName) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: `Requesting: ${actionName}`,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    // Simulate processing
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        type: 'bot',
        content: `I'll help you with ${actionName.toLowerCase()}. ${selectedDocument ? `I'll analyze your selected document "${selectedDocument.fileName}"` : 'Please upload a document first for the best analysis.'} What specific aspects would you like me to focus on?`,
        timestamp: new Date(),
        documentContext: selectedDocument
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-sm"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">LexiGuard Assistant</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Always ready to help</p>
              </div>
            </div>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Motion.button>
          </div>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickAction(action.name)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group text-left"
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{action.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{action.description}</p>
                  </div>
                </Motion.button>
              ))}
            </div>
          </div>
        </div>
      </Motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat Header */}
        <Motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <Motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  LexiGuard Chat Assistant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online • Ready to help with your documents
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Toggle context panel"
              >
                <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Motion.button>
            </div>
          </div>
        </Motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 messages-container">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <style>{`
              .messages-container::-webkit-scrollbar {
                width: 6px;
              }
              .messages-container::-webkit-scrollbar-track {
                background: transparent;
              }
              .messages-container::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.3);
                border-radius: 3px;
              }
              .messages-container::-webkit-scrollbar-thumb:hover {
                background-color: rgba(156, 163, 175, 0.5);
              }
            `}</style>
          
          {/* Welcome Message */}
          {messages.length === 0 && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center py-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to LexiGuard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                I'm here to help you analyze documents, check compliance, assess risks, and answer any questions you might have.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.name)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                  </Motion.button>
                ))}
              </div>
            </Motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <Motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group mb-4`}
              >
                <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[85%]`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className={`px-6 py-4 rounded-2xl shadow-sm border ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-bl-md'
                    }`}>
                      {message.type === 'user' ? (
                        <p className="break-words">{message.content}</p>
                      ) : (
                        <BotMessage 
                          content={message.content} 
                          documentContext={message.documentContext}
                          responseType={message.responseType}
                        />
                      )}
                    </div>
                    <div className={`flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.type === 'bot' && (
                        <div className="flex items-center space-x-1">
                          <Motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Copy message"
                          >
                            <Copy className="h-3 w-3" />
                          </Motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Motion.div 
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      />
                      <Motion.div 
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                      <Motion.div 
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
          <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
                className="hidden"
              />
              
              {/* Attachment Button */}
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-colors flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </Motion.button>
              
              {/* Image Button */}
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-colors flex-shrink-0"
                title="Add image"
              >
                <Image className="h-5 w-5" />
              </Motion.button>
              
              {/* Input Field */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedDocument ? "Ask anything about your document..." : "Type your message or click the mic to record..."}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all min-h-[48px] max-h-[120px]"
                  rows="1"
                />
                
                {/* Send Button */}
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all flex-shrink-0 ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </Motion.button>
              </div>
              
              {/* Voice Button */}
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessingAudio}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : isProcessingAudio
                    ? 'bg-yellow-500 text-white cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}
                title={isRecording ? 'Stop recording' : isProcessingAudio ? 'Processing audio...' : 'Voice input'}
              >
                {isProcessingAudio ? (
                  <Motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Motion.div>
                ) : isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Motion.button>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 flex items-center justify-center space-x-2 text-red-600 dark:text-red-400"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording: {formatRecordingTime(recordingDuration)}</span>
                  <button
                    onClick={stopRecording}
                    className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </Motion.div>
            )}

            {/* Processing Status */}
            {isProcessingAudio && (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Converting speech to text...</span>
              </Motion.div>
            )}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default ChatPage;