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
  Info
} from 'lucide-react';

const ChatPage = () => {
  // Custom component for formatting bot messages
  const BotMessage = ({ content, documentContext, responseType }) => {
    // Special handling for What-If scenario responses
    if (responseType === 'scenario_analysis') {
      return (
        <div className="space-y-4 max-w-full overflow-hidden break-words">
          <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center text-sm text-purple-700 mb-2">
              <Zap className="h-4 w-4 mr-2" />
              What-If Scenario Analysis
            </div>
            <div className="text-xs text-purple-600">
              Advanced predictive analysis based on your contract
            </div>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({children}) => <h2 className="text-lg font-bold text-purple-800 mb-3 flex items-center break-words"><Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" /><span className="break-words">{children}</span></h2>,
              h3: ({children}) => <h3 className="text-base font-semibold text-purple-700 mb-2 break-words">{children}</h3>,
              p: ({children}) => <p className="text-base text-gray-700 leading-7 mb-3 break-words whitespace-pre-wrap">{children}</p>,
              ul: ({children}) => <ul className="list-none space-y-2 mb-3 break-words">{children}</ul>,
              li: ({children}) => <li className="text-base text-gray-700 flex items-start break-words"><span className="inline-block w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 mt-2 flex-shrink-0"></span><span className="break-words">{children}</span></li>,
              strong: ({children}) => <strong className="font-semibold text-purple-900 bg-gradient-to-r from-purple-100 to-pink-100 px-1 rounded break-words">{children}</strong>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50 rounded-r-lg mb-3 break-words">{children}</blockquote>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    // Format the content to handle different types of information
    const formatContent = (text) => {
      // Split content into sections based on patterns
      const sections = text.split(/\n\n/);
      
      return sections.map((section, index) => {
        // Check if section is a numbered list
        if (section.includes('**') && section.includes(':')) {
          return (
            <div key={index} className="mb-4 break-words overflow-hidden">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center break-words"><CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span className="break-words">{children}</span></h1>,
                  h2: ({children}) => <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center break-words"><Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" /><span className="break-words">{children}</span></h2>,
                  h3: ({children}) => <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 break-words">{children}</h3>,
                  p: ({children}) => <p className="text-base text-gray-600 dark:text-gray-300 leading-7 mb-3 break-words whitespace-pre-wrap">{children}</p>,
                  ul: ({children}) => <ul className="list-none space-y-1 mb-3 break-words">{children}</ul>,
                  li: ({children}) => <li className="text-base text-gray-600 dark:text-gray-300 flex items-start break-words"><span className="inline-block w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span><span className="break-words">{children}</span></li>,
                  strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 px-1 rounded break-words">{children}</strong>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-r-lg mb-3 break-words">{children}</blockquote>,
                  code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-green-600 dark:text-green-400 break-all">{children}</code>
                }}
              >
                {section}
              </ReactMarkdown>
            </div>
          );
        }
        
        // Handle risk/warning sections
        if (section.toLowerCase().includes('risk') || section.toLowerCase().includes('warning')) {
          return (
            <div key={index} className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-400 rounded-r-lg break-words overflow-hidden">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({children}) => <p className="text-base text-orange-800 dark:text-orange-200 leading-7 mb-3 break-words whitespace-pre-wrap">{children}</p>,
                      strong: ({children}) => <strong className="font-semibold text-orange-900 dark:text-orange-100 break-words">{children}</strong>
                    }}
                  >
                    {section}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        }
        
        // Handle actionable insights sections
        if (section.toLowerCase().includes('actionable') || section.toLowerCase().includes('recommend')) {
          return (
            <div key={index} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-l-4 border-blue-400 rounded-r-lg break-words overflow-hidden">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({children}) => <p className="text-base text-blue-800 dark:text-blue-200 leading-7 mb-3 break-words whitespace-pre-wrap">{children}</p>,
                      strong: ({children}) => <strong className="font-semibold text-blue-900 dark:text-blue-100 break-words">{children}</strong>,
                      ul: ({children}) => <ul className="list-none space-y-1 mb-3 break-words">{children}</ul>,
                      li: ({children}) => <li className="text-base text-blue-700 dark:text-blue-300 flex items-start break-words"><span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span><span className="break-words">{children}</span></li>
                    }}
                  >
                    {section}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        }
        
        // Default formatting
        return (
          <div key={index} className="mb-3 break-words overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({children}) => <p className="text-base text-gray-700 dark:text-gray-300 leading-7 mb-3 break-words whitespace-pre-wrap">{children}</p>,
                strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white break-words">{children}</strong>,
                ul: ({children}) => <ul className="list-none space-y-1 mb-3 break-words">{children}</ul>,
                li: ({children}) => <li className="text-base text-gray-700 dark:text-gray-300 flex items-start break-words"><span className="inline-block w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span><span className="break-words">{children}</span></li>
              }}
            >
              {section}
            </ReactMarkdown>
          </div>
        );
      });
    };

    return (
      <div className="space-y-2 max-w-full overflow-hidden break-words">
        {documentContext && (
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center text-xs text-blue-600 mb-2">
              <FileText className="h-3 w-3 mr-1" />
              Document Context Applied
            </div>
            <div className="text-xs text-blue-700">
              {documentContext.fileName && `📄 ${documentContext.fileName}`}
              {documentContext.summary && ` - ${documentContext.summary}`}
            </div>
          </Motion.div>
        )}
        {formatContent(content)}
      </div>
    );
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant powered by advanced language models. I can help you analyze documents, check compliance, assess risks, and much more! 🚀',
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: 2,
      type: 'user',
      content: 'Can you help me analyze the compliance requirements in my latest contract document?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8)
    },
    {
      id: 3,
      type: 'bot',
      content: 'Absolutely! I\'d be happy to help you with compliance analysis. Please upload your contract document and I\'ll provide a comprehensive analysis including:\n\n• Key compliance clauses identification\n• Regulatory requirements assessment\n• Risk level evaluation\n• Recommendations for improvements\n\nJust drag and drop your file or click the attachment button below! 📄',
      timestamp: new Date(Date.now() - 1000 * 60 * 6)
    },
    {
      id: 4,
      type: 'user',
      content: 'That sounds perfect! What file formats do you support?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4)
    },
    {
      id: 5,
      type: 'bot',
      content: 'I support a wide range of document formats:\n\n✅ PDF files (.pdf)\n✅ Word documents (.docx, .doc)\n✅ Text files (.txt)\n✅ PowerPoint (.pptx, .ppt)\n✅ Excel spreadsheets (.xlsx, .xls)\n✅ Images with text (.jpg, .png)\n\nMaximum file size: 25MB per document. I can analyze multiple documents simultaneously! 🎯',
      timestamp: new Date(Date.now() - 1000 * 60 * 2)
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [userDocuments, setUserDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, complete
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Helper function to get status text
  const getAnalysisStatusText = () => {
    switch(analysisStatus) {
      case 'analyzing': return 'Analyzing...';
      case 'complete': return 'Analysis complete';
      default: return selectedDocument ? 'Ready for analysis' : 'No document selected';
    }
  };

  // Fetch user documents from Cloudinary
  const fetchUserDocuments = async () => {
    setLoadingDocuments(true);
    try {
      // Get current user ID - use Firebase auth if available, otherwise demo user
      let userId = 'demo-user'; // Default fallback
      
      // Try to get Firebase auth user first
      try {
        const { getCurrentUser } = await import('../services/documentService');
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.uid) {
          userId = currentUser.uid;
          console.log('Using Firebase user ID:', userId);
        } else {
          // Try localStorage as fallback
          const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (storedUser.uid) {
            userId = storedUser.uid;
            console.log('Using stored user ID:', userId);
          } else {
            console.log('No authenticated user found, using demo-user');
          }
        }
      } catch {
        console.log('Firebase auth not available, using demo-user');
      }

      console.log(`Fetching documents for user: ${userId}`);
      const response = await fetch(`http://localhost:8080/api/chat/documents/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUserDocuments(data.documents || []);
      } else {
        console.error('Failed to fetch documents:', data.error);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Load documents when component mounts
  useEffect(() => {
    fetchUserDocuments();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset analysis status when document changes
  useEffect(() => {
    setAnalysisStatus('idle');
  }, [selectedDocument]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      const currentInput = inputMessage;
      setInputMessage('');
      
      // Send to Gemini AI with document context if available
      setIsTyping(true);
      if (selectedDocument) {
        setAnalysisStatus('analyzing');
      }
      try {
        const endpoint = selectedDocument 
          ? 'http://localhost:8080/api/chat/message-with-document'
          : 'http://localhost:8080/api/chat/message';

        const requestBody = {
          message: currentInput,
          context: 'Legal document analysis and compliance checking',
          ...(selectedDocument && {
            documentUrl: selectedDocument.url,
            fileName: selectedDocument.fileName,
            userId: selectedDocument.userId || 'demo-user'
          })
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (data.success) {
          const botResponse = {
            id: messages.length + 2,
            type: 'bot',
            content: data.response,
            timestamp: new Date(),
            documentContext: data.documentContext || null,
            responseType: data.responseType || 'regular_chat'
          };
          setMessages(prev => [...prev, botResponse]);
          if (selectedDocument) {
            setAnalysisStatus('complete');
          }
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'I apologize, but I encountered an error while processing your request. Please make sure the server is running and try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
        if (selectedDocument) {
          setAnalysisStatus('idle');
        }
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      
      // Process file with Gemini AI
      setIsTyping(true);
      try {
        // For now, we'll send a document analysis request
        // In a production app, you'd want to extract text from the file first
        const response = await fetch('http://localhost:8080/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `I've uploaded a document named "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB). Please provide a comprehensive analysis including compliance requirements, risk factors, and key insights for this type of document.`,
            context: 'Document upload and analysis',
            documentContent: '' // In production, extract and include actual document text
          })
        });

        const data = await response.json();
        
        if (data.success) {
          const botResponse = {
            id: messages.length + 2,
            type: 'bot',
            content: data.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
        } else {
          throw new Error(data.error || 'Failed to analyze document');
        }
      } catch (error) {
        console.error('Error analyzing document:', error);
        const errorResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: `I received your document "${file.name}", but encountered an error during analysis. Please ensure the server is running and try uploading again.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const quickActions = [
    { name: 'Document Summary', icon: FileText, color: 'from-blue-500 to-cyan-500', description: 'Get key insights' },
    { name: 'Compliance Check', icon: Shield, color: 'from-green-500 to-emerald-500', description: 'Regulatory analysis' },
    { name: 'Risk Assessment', icon: BarChart3, color: 'from-yellow-500 to-orange-500', description: 'Identify potential risks' },
    { name: 'What-If Scenarios', icon: Zap, color: 'from-purple-500 to-pink-500', description: 'Explore hypotheticals' },
    { name: 'Export Report', icon: Download, color: 'from-gray-500 to-gray-600', description: 'Download analysis' }
  ];

  const handleQuickAction = async (actionName) => {
    if (actionName === 'What-If Scenarios') {
      // Handle What-If scenarios specially
      await handleWhatIfScenariosAction();
      return;
    }

    const actionQueries = {
      'Document Summary': 'Please provide a comprehensive summary of legal documents commonly used in business, including key components and best practices.',
      'Compliance Check': 'What are the main compliance requirements I should be aware of for legal documents? Please provide a detailed compliance checklist.',
      'Risk Assessment': 'Can you help me understand the common risk factors in legal documents and how to identify potential legal risks?',
      'Export Report': 'How can I create and format professional legal analysis reports? What sections should I include?'
    };

    const query = actionQueries[actionName];
    if (!query) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: `Quick Action: ${actionName}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to Gemini AI
    setIsTyping(true);
    try {
      const response = await fetch('http://localhost:8080/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          context: `User requested quick action: ${actionName}. Provide specialized legal guidance.`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to process quick action');
      }
    } catch (error) {
      console.error('Error with quick action:', error);
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `I apologize, but I encountered an error while processing your ${actionName} request. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleWhatIfScenariosAction = async () => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: 'Quick Action: What-If Scenarios',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Fetch What-If examples based on selected document type
    setIsTyping(true);
    try {
      const documentType = selectedDocument ? 'contract' : 'contract'; // Could be enhanced to detect type
      const response = await fetch(`http://localhost:8080/api/chat/what-if-examples?documentType=${encodeURIComponent(documentType)}&jurisdiction=India`);
      const data = await response.json();
      
      if (data.success) {
        let botContent = `## 🔮 ${data.helpText.title}\n\n`;
        botContent += `${data.helpText.description}\n\n`;
        
        if (selectedDocument) {
          botContent += `### 📄 Based on your selected document: ${selectedDocument.fileName}\n\n`;
        }
        
        botContent += `### 💡 Example Questions You Can Ask:\n\n`;
        data.examples.forEach((example, index) => {
          botContent += `${index + 1}. **"${example}"**\n`;
        });
        
        botContent += `\n### 🎯 How to Use:\n\n`;
        data.helpText.instructions.forEach((instruction) => {
          botContent += `• ${instruction}\n`;
        });
        
        botContent += `\n### ✨ Benefits:\n\n`;
        data.helpText.benefits.forEach((benefit) => {
          botContent += `• ${benefit}\n`;
        });
        
        if (selectedDocument) {
          botContent += `\n---\n\n💬 **Try asking me one of the questions above, or create your own scenario!** I'll analyze it against your selected document and provide detailed insights.\n\n`;
          botContent += `🔍 **Example**: Type "What if I need to terminate this contract early?" and I'll tell you exactly what clauses apply and what the consequences would be.`;
        } else {
          botContent += `\n---\n\n📄 **To get document-specific scenario analysis**: Select a document from the dropdown above, then ask your "What if..." question!\n\n`;
          botContent += `💡 **For now**: You can ask general scenario questions and I'll provide insights based on common contract principles.`;
        }

        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: botContent,
          timestamp: new Date(),
          responseType: 'what_if_examples'
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to get What-If examples');
      }
    } catch (error) {
      console.error('Error getting What-If examples:', error);
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `I apologize, but I encountered an error while getting What-If scenario examples. Here are some common scenarios you can ask about:\n\n• What if I need to terminate this contract early?\n• What happens if payments are delayed?\n• What if there's a dispute about contract terms?\n• What are my options if the other party breaches the contract?\n\nJust ask me any "What if..." question and I'll help analyze the situation!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-h-full">
        {/* Header */}
        <Motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Motion.div 
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Bot className="h-8 w-8 text-white" />
              </Motion.div>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  AI Assistant
                  <Motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="ml-2"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Motion.div>
                </h1>
                <p className="text-green-100 text-sm">Powered by Advanced Language Models • Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
              >
                <Settings className="h-5 w-5 text-white" />
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
              >
                <MoreVertical className="h-5 w-5 text-white" />
              </Motion.button>
            </div>
          </div>
        </Motion.div>

        {/* Document Selector */}
        <Motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Document Context:
              </label>
              <select 
                value={selectedDocument?.public_id || ''}
                onChange={(e) => {
                  const doc = userDocuments.find(d => d.public_id === e.target.value);
                  setSelectedDocument(doc || null);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loadingDocuments}
              >
                <option value="">
                  {loadingDocuments ? 'Loading documents...' : 'No document selected'}
                </option>
                {userDocuments.map((doc) => (
                  <option key={doc.public_id} value={doc.public_id}>
                    📄 {doc.fileName || doc.public_id.split('/').pop()}
                  </option>
                ))}
              </select>
              {loadingDocuments && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>
            
            {selectedDocument && (
              <Motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Using: {selectedDocument.fileName || 'Document'}
                </span>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove document context"
                >
                  <X className="h-4 w-4" />
                </button>
              </Motion.div>
            )}
          </div>
        </Motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6 min-h-0 max-h-full messages-container" 
             style={{ 
               scrollbarWidth: 'thin',
               scrollbarColor: '#CBD5E0 transparent'
             }}>
          <style>{`
            .messages-container::-webkit-scrollbar {
              width: 6px;
            }
            .messages-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .messages-container::-webkit-scrollbar-thumb {
              background-color: #CBD5E0;
              border-radius: 3px;
            }
            .messages-container::-webkit-scrollbar-thumb:hover {
              background-color: #A0AEC0;
            }
          `}</style>
          <AnimatePresence>
            {messages.map((message, index) => (
              <Motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`${message.type === 'user' ? 'max-w-[70%]' : 'max-w-[75%]'} flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 min-w-0`}>
                  {/* Avatar */}
                  <Motion.div 
                    className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </Motion.div>
                  
                  {/* Message Bubble */}
                  <div className={`px-6 py-4 rounded-3xl shadow-lg relative overflow-hidden break-words ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white ml-3' 
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 mr-3'
                  }`}>
                    {message.type === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-line break-words">
                        {message.content}
                      </p>
                    ) : (
                      <BotMessage 
                        content={message.content} 
                        documentContext={message.documentContext}
                        responseType={message.responseType}
                      />
                    )}
                    <p className={`text-xs mt-3 flex items-center ${
                      message.type === 'user' 
                        ? 'text-purple-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.isFile && (
                        <Motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                        >
                          FILE
                        </Motion.span>
                      )}
                    </p>
                  </div>
                </div>
              </Motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 px-6 py-4 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2 items-center">
                      <div className="flex space-x-1">
                        <Motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <Motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <Motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 min-h-fit"
        >
          <div className="flex items-end space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
              className="hidden"
            />
            
            <Motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Paperclip className="h-5 w-5" />
            </Motion.button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your documents, compliance, or risk analysis..."
                className="w-full px-6 py-4 pr-16 rounded-3xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
                rows="1"
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="absolute right-3 bottom-3 p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-5 w-5" />
              </Motion.button>
            </div>
          </div>
        </Motion.div>
      </div>

      {/* Context Panel */}
      <AnimatePresence>
        {isContextPanelOpen && (
          <Motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-shrink-0"
          >
            <div className="p-6 h-full overflow-y-auto">
              {/* Current Session */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-green-500 mr-2" />
                  Current Session
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                  {selectedDocument ? (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {selectedDocument.fileName || selectedDocument.public_id?.split('/').pop() || 'Unknown file'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(selectedDocument.fileSize)} • {getAnalysisStatusText()}
                          </p>
                        </div>
                      </div>
                      
                      {analysisStatus === 'analyzing' && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Processing...</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <Motion.div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {analysisStatus === 'complete' && (
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Analysis completed successfully
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl inline-block mb-3">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">No Document Selected</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Select a document above to start analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action.name)}
                      className={`w-full text-left p-4 rounded-2xl text-white bg-gradient-to-r ${action.color} shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <action.icon className="h-5 w-5" />
                          <div>
                            <p className="font-medium text-sm">{action.name}</p>
                            <p className="text-xs opacity-90">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    </Motion.button>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Capabilities</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Document Analysis', progress: 98 },
                    { name: 'Risk Assessment', progress: 95 },
                    { name: 'Compliance Check', progress: 92 },
                    { name: 'Data Extraction', progress: 89 }
                  ].map((capability, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{capability.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{capability.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <Motion.div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${capability.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
