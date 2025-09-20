import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden transition-all duration-500">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative border border-white/20"
      >
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-pink-100/50 via-purple-100/30 to-transparent dark:from-gray-700/50 dark:via-purple-800/30 rounded-l-full z-0"
          style={{ y: backgroundY }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-200/60 via-pink-200/40 to-purple-200/60 dark:from-orange-800/30 dark:via-pink-800/20 dark:to-purple-800/30 rounded-full z-0"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-600 dark:to-orange-600 rounded-full z-0 shadow-lg"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <Shield className="h-8 w-8 text-sky-600" />
              <span className="text-2xl font-bold text-sky-800 dark:text-white">LexiGuard</span>
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-6"
            >
              {/* Navigation items removed as requested */}
            </motion.div>
          </nav>

          {/* Main content */}
          <div className="flex flex-col md:flex-row items-center justify-between flex-grow">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Understand Contracts.
                </span>
                <br />
                <motion.span
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Make Better Decisions
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-sky-700 dark:text-gray-300 mb-6 max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Your personal AI legal navigator. Understand contract clauses, surface risks,
                and get role-aware guidance in clear language.
              </motion.p>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <motion.button
                  onClick={() => navigate('/upload')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Try Demo
                </motion.button>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="p-4 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-sky-800 dark:text-white">Risk Visuals</h4>
                  <p className="text-sm text-sky-600 dark:text-gray-300">Traffic-light style risk summaries for clauses.</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="p-4 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-sky-800 dark:text-white">Role Advice</h4>
                  <p className="text-sm text-sky-600 dark:text-gray-300">Advice tuned to your role.</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="p-4 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-sky-800 dark:text-white">Chat</h4>
                  <p className="text-sm text-sky-600 dark:text-gray-300">Ask questions about the document.</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="md:w-1/2 flex justify-center"
            >
              {/* Vite logo removed */}
            </motion.div>
          </div>
        </div>
      </motion.div>
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

