import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Upload,
  MessageSquare,
  Eye,
  Zap,
  CheckCircle,
  Clock,
  Brain,
  TrendingUp,
} from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-left hover:shadow-sm transition-all duration-200 w-full"
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </motion.button>
);

const ActivityItem = ({ title, description, time, status, icon: Icon }) => {
  const statusColors = {
    success: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    error: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${statusColors[status]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{time}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: "89",
      change: "+5%",
      changeType: "positive",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Risk Alerts",
      value: "23",
      change: "-8%",
      changeType: "positive",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
    {
      title: "Processing Speed",
      value: "1.2s",
      change: "-15%",
      changeType: "positive",
      icon: Zap,
      color: "bg-purple-500",
    },
  ];

  const quickActions = [
    {
      title: "Upload Document",
      description: "Analyze a new contract or legal document",
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log("Upload clicked"),
    },
    {
      title: "AI Chat",
      description: "Ask questions about your documents",
      icon: MessageSquare,
      color: "bg-green-500",
      onClick: () => console.log("Chat clicked"),
    },
    {
      title: "View Reports",
      description: "See detailed analytics and insights",
      icon: BarChart3,
      color: "bg-purple-500",
      onClick: () => console.log("Reports clicked"),
    },
  ];

  const recentActivity = [
    {
      title: "Document Analysis Complete",
      description: "Employment agreement processed successfully",
      time: "2 minutes ago",
      status: "success",
      icon: CheckCircle,
    },
    {
      title: "AI Recommendation Generated",
      description: "New suggestions for liability clause",
      time: "15 minutes ago",
      status: "info",
      icon: Brain,
    },
    {
      title: "Risk Alert",
      description: "High-risk clause detected in vendor contract",
      time: "1 hour ago",
      status: "warning",
      icon: AlertTriangle,
    },
    {
      title: "Team Member Added",
      description: "Sarah Chen joined the legal team",
      time: "3 hours ago",
      status: "info",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your legal document overview.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
              </div>
            </div>
            <div className="p-2">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Overview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Document Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">23</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processed Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;