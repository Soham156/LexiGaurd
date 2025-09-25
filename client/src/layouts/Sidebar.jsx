import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Users,
  Settings,
  MessageSquare,
  Shield,
  Bell,
  BarChart3,
  Globe,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'from-blue-500 to-indigo-600' },
    { icon: FileText, label: 'Documents', path: '/dashboard/documents', color: 'from-emerald-500 to-teal-600' },
    { icon: Globe, label: 'Summary', path: '/dashboard/summary', color: 'from-purple-500 to-pink-600' },
    { icon: BarChart3, label: 'Benchmark', path: '/dashboard/benchmark', color: 'from-orange-500 to-red-600' },
    { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat', color: 'from-green-500 to-emerald-600' },
    { icon: Users, label: 'Team', path: '/dashboard/team', color: 'from-cyan-500 to-blue-600' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications', color: 'from-yellow-500 to-orange-600' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', color: 'from-indigo-500 to-purple-600' },
  ];

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' },
  };

  const NavItem = ({ icon: Icon, label, path, color }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link to={path}>
        <motion.div
          className={`group relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isActive 
              ? `bg-gradient-to-r ${color} text-white shadow-sm` 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center w-full">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3 text-sm font-medium">{label}</span>
          </div>
          {isActive && (
            <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
          )}
        </motion.div>
      </Link>
    );
  };



  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 h-screen z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">LexiGuard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Document Analysis</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;