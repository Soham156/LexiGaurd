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
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
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
    
    return (
      <Link to={path}>
        <motion.div
          className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors ${
            isActive
              ? 'bg-sky-600 text-white'
              : 'text-sky-700 hover:bg-sky-100'
          }`}
          whileHover={{ scale: 1.02 }}
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
      className="h-screen bg-white border-r border-sky-100 py-6 shadow-lg relative"
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
          <Shield className="h-8 w-8 text-sky-600" />
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold text-sky-800">
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
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white border border-sky-100 text-sky-600 hover:bg-sky-50"
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