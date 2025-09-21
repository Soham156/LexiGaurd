import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-gray-900 transition-colors">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={setSidebarCollapsed} 
      />
      <main 
        className={`pt-20 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;