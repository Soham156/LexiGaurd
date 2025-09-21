import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Shield,
  Bell,
  BarChart3,
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
    { icon: BarChart3, label: 'Market Benchmark', path: '/dashboard/benchmark' },
    { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat' },
    { icon: Users, label: 'Team', path: '/dashboard/team' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' },
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive = location.pathname === path;
    
    // Define color schemes for each nav item
    const getItemColors = (path) => {
      switch (path) {
        case '/dashboard':
          return isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 hover:text-purple-700 dark:hover:text-purple-300';
        case '/dashboard/documents':
          return isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 hover:text-blue-700 dark:hover:text-blue-300';
        case '/dashboard/benchmark':
          return isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 hover:text-emerald-700 dark:hover:text-emerald-300';
        case '/dashboard/chat':
          return isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 hover:text-green-700 dark:hover:text-green-300';
        case '/dashboard/team':
          return isActive ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/50 dark:hover:to-red-900/50 hover:text-orange-700 dark:hover:text-orange-300';
        case '/dashboard/notifications':
          return isActive ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/50 dark:hover:to-amber-900/50 hover:text-yellow-700 dark:hover:text-yellow-300';
        case '/dashboard/settings':
          return isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 hover:text-indigo-700 dark:hover:text-indigo-300';
        default:
          return isActive ? 'bg-sky-600 text-white' : 'text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-gray-800';
      }
    };
    
    return (
      <Link to={path}>
        <motion.div
          className={`flex items-center px-4 py-3 my-2 rounded-xl transition-all duration-300 ${getItemColors(path)}`}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-5 h-5" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">{label}</span>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border-r border-sky-100 dark:border-gray-700 py-6 shadow-lg relative transition-colors"
      style={{ height: 'calc(100vh - 80px)' }}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="px-4 mb-8">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              LexiGuard
            </span>
          )}
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="px-2">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Collapse Button */}
      <motion.button
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-sky-100 dark:border-gray-600 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;