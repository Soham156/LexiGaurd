import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  Clock, 
  FileText, 
  User, 
  AlertCircle, 
  CheckCircle,
  X,
  Filter,
  Search
} from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      type: 'document',
      title: 'Document Analysis Complete',
      message: 'Contract_Review_v2.pdf has been processed successfully',
      time: '5 minutes ago',
      read: false,
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg',
    },
    {
      id: 2,
      type: 'alert',
      title: 'High Risk Document Detected',
      message: 'Legal_Agreement_Draft.pdf contains potential compliance issues',
      time: '12 minutes ago',
      read: false,
      icon: AlertCircle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-400 to-pink-500 shadow-lg',
    },
    {
      id: 3,
      type: 'user',
      title: 'Team Member Added',
      message: 'Emma Wilson has been added to your team',
      time: '1 hour ago',
      read: true,
      icon: User,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg',
    },
    {
      id: 4,
      type: 'document',
      title: 'Document Shared',
      message: 'Privacy_Policy_Update.pdf has been shared with you',
      time: '2 hours ago',
      read: true,
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg',
    },
    {
      id: 5,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin at 2:00 AM EST',
      time: '1 day ago',
      read: true,
      icon: CheckCircle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg',
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === notification.type);
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with your recent activities and alerts</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800">
            {unreadCount} unread
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['all', 'unread', 'document', 'alert', 'user', 'system'].map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-semibold text-sky-900">Recent Notifications</h2>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-sky-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sky-900 mb-2">No notifications found</h3>
            <p className="text-sky-600">
              {searchQuery ? 'Try adjusting your search query' : 'Check back later for updates'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sky-100">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 hover:bg-sky-25 transition-colors ${
                  !notification.read ? 'border-l-4 border-l-sky-500 bg-sky-25' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                    <notification.icon className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-sky-900' : 'text-sky-700'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-sky-500 rounded-full ml-2"></span>
                          )}
                        </h3>
                        <p className="text-sky-600 text-sm mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-sky-400" />
                          <span className="text-sky-500 text-xs">{notification.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;