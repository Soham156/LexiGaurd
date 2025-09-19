import React from 'react';
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
} from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-sky-900 mb-2">Settings</h1>
        <p className="text-sky-600">Manage your account and application preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-semibold text-sky-900">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Role
              </label>
              <select className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none">
                <option>Legal Professional</option>
                <option>Business Manager</option>
                <option>Individual</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-semibold text-sky-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sky-900">Email Notifications</p>
                <p className="text-sm text-sky-600">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sky-900">Risk Alerts</p>
                <p className="text-sm text-sky-600">Get notified of high-risk clauses</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sky-900">Document Updates</p>
                <p className="text-sm text-sky-600">Notify when documents are processed</p>
              </div>
              <input type="checkbox" className="rounded text-sky-600" />
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-semibold text-sky-900">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
              <Key className="w-5 h-5 text-sky-600" />
              <span className="text-sky-900">Change Password</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sky-900">Two-Factor Auth</p>
                <p className="text-sm text-sky-600">Add extra security</p>
              </div>
              <input type="checkbox" className="rounded text-sky-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Settings */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-sky-900 mb-6">Data Management</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors">
              <Download className="w-5 h-5 text-sky-600" />
              <span className="text-sky-900">Export Data</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-sky-900 mb-6">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-700 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;