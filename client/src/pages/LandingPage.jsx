import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, ArrowRight, FileText, Zap, Users, Award, Mail, Phone, MapPin, 
  Github, Twitter, Linkedin, Star, CheckCircle, Eye, Brain, MessageSquare,
  Lock, Clock, TrendingUp, BarChart3, Globe, Sparkles, ChevronDown,
  Play, Download, Upload, Search, Filter, Settings, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Professional animated background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)
          `
        }}
        animate={{
          background: [
            `
              radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)
            `,
            `
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 60% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              linear-gradient(225deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)
            `,
            `
              radial-gradient(circle at 40% 60%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              linear-gradient(315deg, rgba(147, 51, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)
            `
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated mesh pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px', '0px 0px']
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 8
          }}
        />
      ))}
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LexiGuard
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Reviews</a>
              <motion.button
                onClick={() => navigate('/signin')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign In with Google</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 overflow-hidden relative min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>
        
        {/* Dynamic Professional Animations */}
        <div className="absolute inset-0 z-10">
          {/* Floating Geometric Shapes */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg blur-lg rotate-45"
            animate={{
              y: [0, 40, 0],
              x: [0, -25, 0],
              rotate: [45, 90, 45],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          <motion.div
            className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-lg"
            animate={{
              y: [0, -20, 0],
              x: [0, 30, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-xl blur-xl rotate-12"
            animate={{
              y: [0, 25, 0],
              x: [0, -15, 0],
              rotate: [12, -12, 12],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent"
              animate={{
                y: ['-100%', '100%'],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: 3
              }}
            />
          </div>
          
          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
          
          {/* Pulsing Rings */}
          <motion.div
            className="absolute top-1/2 left-1/4 w-64 h-64 border border-purple-300/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/4 w-48 h-48 border border-pink-300/20 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-16 right-16 w-40 h-40 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 100%)'
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-16 left-16 w-36 h-36 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(34, 211, 238, 0.2) 50%, transparent 100%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          {/* Additional Dynamic Elements */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-purple-200/10 rounded-full"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          
          {/* Floating Code-like Elements */}
          <motion.div
            className="absolute top-32 left-1/4 text-purple-300/20 font-mono text-sm"
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {'{ "risk": "analyzed" }'}
          </motion.div>
          
          <motion.div
            className="absolute bottom-32 right-1/4 text-pink-300/20 font-mono text-sm"
            animate={{
              y: [0, 15, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            {'AI.analyze(contract)'}
          </motion.div>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85 z-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Legal Analysis
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Understand Contracts.
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Make Better Decisions.
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
              >
                Transform complex legal documents into clear, actionable insights with our AI-powered analysis platform. 
                Get instant risk assessments, role-specific guidance, and intelligent contract reviews.
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.button
                  onClick={() => navigate('/signin')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>5-Minute Setup</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                {/* Mock Interface */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Contract Analysis</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="text-sm">High Risk: Unlimited liability clause detected</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="text-sm">Medium Risk: Payment terms require review</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="text-sm">Low Risk: Standard termination clause</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-purple-900 dark:text-purple-100">AI Recommendation</div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          Consider negotiating liability caps to limit exposure...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Eye className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to analyze, understand, and act on legal documents with confidence and speed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms analyze contract clauses, identify risks, and provide intelligent recommendations tailored to your role.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Eye,
                title: "Visual Risk Assessment",
                description: "Traffic-light color coding makes it easy to spot high, medium, and low-risk clauses at a glance. No legal expertise required.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: MessageSquare,
                title: "Interactive Chat",
                description: "Ask questions about any document in natural language. Get instant answers and clarifications from our AI assistant.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-level encryption, SOC 2 compliance, and zero-trust architecture ensure your sensitive documents stay protected.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share insights, add comments, and collaborate with team members. Manage permissions and track document history.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process documents in seconds, not hours. Our optimized AI infrastructure delivers results faster than traditional review methods.",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get from document upload to actionable insights in three simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Document",
                description: "Drag and drop your contract or legal document. We support PDF, Word, and text formats.",
                icon: Upload,
                color: "purple"
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our advanced AI analyzes every clause, identifies risks, and generates role-specific insights.",
                icon: Brain,
                color: "pink"
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Review visual risk assessments, chat with AI, and make informed decisions with confidence.",
                icon: BarChart3,
                color: "blue"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`text-6xl font-bold text-${step.color}-200 dark:text-${step.color}-800 mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Legal Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of lawyers, compliance officers, and business professionals who rely on LexiGuard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "50K+",
                label: "Documents Analyzed",
                gradient: "from-purple-600 to-pink-600",
                icon: FileText
              },
              {
                number: "99.9%",
                label: "Accuracy Rate",
                gradient: "from-blue-600 to-cyan-600",
                icon: TrendingUp
              },
              {
                number: "5K+",
                label: "Happy Clients",
                gradient: "from-green-600 to-emerald-600",
                icon: Users
              },
              {
                number: "24/7",
                label: "Support Available",
                gradient: "from-orange-600 to-red-600",
                icon: Clock
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core AI analysis features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                description: "Perfect for individuals getting started with contract analysis",
                features: [
                  "5 documents per month",
                  "Basic risk assessment",
                  "AI chat support",
                  "Email support"
                ],
                buttonText: "Sign In with Google",
                popular: false
              },
              {
                name: "Professional",
                price: "$29",
                period: "per month",
                description: "Ideal for legal professionals and small teams",
                features: [
                  "100 documents per month",
                  "Advanced risk analysis",
                  "Role-specific insights",
                  "Team collaboration",
                  "Priority support",
                  "Custom templates"
                ],
                buttonText: "Sign In with Google",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large organizations with advanced needs",
                features: [
                  "Unlimited documents",
                  "Custom AI training",
                  "Advanced security",
                  "API access",
                  "Dedicated support",
                  "Custom integrations"
                ],
                buttonText: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 ${
                  plan.popular 
                    ? 'border-purple-500 dark:border-purple-400' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/signin')}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by Legal Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what our users have to say about transforming their document analysis workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Senior Legal Advisor",
                company: "TechCorp Legal",
                content: "LexiGuard has revolutionized how we handle document reviews. The AI insights are incredibly accurate and save us hours of work. The risk visualization feature is a game-changer.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                role: "Compliance Officer", 
                company: "FinanceFirst",
                content: "The security features are top-notch. We can trust LexiGuard with our most sensitive documents without any concerns. The enterprise-grade encryption gives us peace of mind.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Emily Rodriguez",
                role: "Contract Manager",
                company: "Global Ventures",
                content: "The collaborative features make it easy for our team to work together on document analysis. The role-specific insights help everyone understand their responsibilities.",
                rating: 5,
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional testimonials row */}
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {[
              {
                name: "David Park",
                role: "General Counsel",
                company: "StartupHub",
                content: "The speed and accuracy of LexiGuard's analysis is remarkable. What used to take our team days now takes minutes.",
                rating: 5,
                avatar: "DP"
              },
              {
                name: "Lisa Thompson",
                role: "Risk Manager",
                company: "Insurance Plus",
                content: "The visual risk indicators make it so easy to prioritize which contracts need immediate attention. Brilliant UX design.",
                rating: 5,
                avatar: "LT"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (index + 3) * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"
          animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your 
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Document Workflow?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of legal professionals who trust LexiGuard to analyze contracts, 
              identify risks, and make better decisions faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={() => navigate('/signin')}
                className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign In with Google</span>
              </motion.button>
              
              <motion.button
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center mb-6"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg mr-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LexiGuard
                </span>
              </motion.div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg max-w-md">
                Empowering legal professionals with AI-driven document analysis. 
                Transform complex contracts into clear, actionable insights with enterprise-grade security.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#", color: "hover:text-blue-400", label: "Twitter" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-600", label: "LinkedIn" },
                  { icon: Github, href: "#", color: "hover:text-gray-400", label: "GitHub" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`p-3 bg-gray-800 rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    whileHover={{ y: -3 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Product</h3>
              <div className="space-y-3">
                {[
                  { name: "Features", href: "#features" },
                  { name: "How It Works", href: "#how-it-works" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "API Documentation", href: "/docs" },
                  { name: "Integrations", href: "/integrations" }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
              <div className="space-y-3">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Careers", href: "/careers" },
                  { name: "Blog", href: "/blog" },
                  { name: "Security", href: "/security" },
                  { name: "Support", href: "/support" }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-300">Get the latest updates on AI legal technology and product news.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              © 2025 LexiGuard. All rights reserved. Built with ❤️ for legal professionals.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              <a href="/gdpr" className="text-gray-400 hover:text-white transition-colors">GDPR</a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ href, children }) => (
  <motion.a
    href={href}
    className="text-sky-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors relative"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
    <motion.span
      className="absolute left-0 right-0 bottom-0 h-0.5 bg-sky-600 dark:bg-sky-400"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  </motion.a>
);

export default LandingPage;

