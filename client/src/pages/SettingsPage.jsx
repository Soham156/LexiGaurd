import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Key,
  Mail,
  Camera,
  Save,
  Edit3,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Database,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    riskAlerts: true,
    documentUpdates: false,
    teamActivity: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'data', name: 'Data', icon: Database },
  ];

  const ToggleSwitch = ({ enabled, onChange }) => (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
        layout
      />
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and application settings</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeTab === tab.id ? 'rotate-90' : ''
                  }`} />
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2 inline" />
                      Save Changes
                    </motion.button>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        AJ
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600"
                      >
                        <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Alex Johnson</h3>
                      <p className="text-gray-600 dark:text-gray-400">Legal Professional</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Change Photo
                      </motion.button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Johnson"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="alex.johnson@example.com"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Senior Legal Advisor"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        defaultValue="LegalTech Solutions"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password Section */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Password</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 3 months ago</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Change Password
                        </motion.button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                          </div>
                        </div>
                        <ToggleSwitch enabled={true} onChange={() => {}} />
                      </div>
                    </div>

                    {/* Login Sessions */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <Monitor className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your active login sessions</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Sign Out All
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Current Session</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Chrome on Windows • New York, NY</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {Object.entries({
                      email: { title: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                      push: { title: 'Push Notifications', desc: 'Browser and mobile notifications', icon: Bell },
                      riskAlerts: { title: 'Risk Alerts', desc: 'High-priority security notifications', icon: Shield },
                      documentUpdates: { title: 'Document Updates', desc: 'When documents are processed', icon: FileText },
                      teamActivity: { title: 'Team Activity', desc: 'Collaboration and team updates', icon: User }
                    }).map(([key, setting]) => (
                      <div key={key} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <setting.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{setting.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{setting.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch 
                          enabled={notifications[key]} 
                          onChange={(value) => setNotifications(prev => ({ ...prev, [key]: value }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other tabs would be implemented similarly */}
              {activeTab === 'preferences' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Application Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;