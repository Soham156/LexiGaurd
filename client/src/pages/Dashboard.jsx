import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle,
  BarChart3,
  Clock,
  Shield,
  Brain,
  Eye,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Upload,
  Download,
  Star,
  Zap
} from 'lucide-react';

// Professional Metric Card Component
const MetricCard = ({ icon: Icon, label, value, change, changeType, trend, gradient, iconColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, scale: 1.01 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="flex items-center space-x-1">
        {changeType === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
      {trend && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{trend}</p>
      )}
    </div>
  </motion.div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, gradient }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-4 rounded-xl ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 w-full`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </motion.button>
);

// Recent Activity Component
const RecentActivity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
    </div>
    <div className="space-y-4">
      {[
        {
          icon: CheckCircle,
          title: "Contract Review Completed",
          time: "2 hours ago",
          description: "Employment Agreement analysis finished",
          status: "success",
          priority: "high"
        },
        {
          icon: AlertTriangle,
          title: "Risk Alert Detected",
          time: "5 hours ago",
          description: "High-risk liability clause found in NDA",
          status: "warning",
          priority: "urgent"
        },
        {
          icon: Brain,
          title: "AI Analysis Complete",
          time: "1 day ago",
          description: "Service Agreement processed successfully",
          status: "info",
          priority: "medium"
        },
        {
          icon: Users,
          title: "Team Collaboration",
          time: "2 days ago",
          description: "Legal team reviewed partnership agreement",
          status: "success",
          priority: "low"
        },
      ].map((item, index) => {
        const statusStyles = {
          success: { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
          warning: { bg: 'bg-orange-100 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
          info: { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
        };
        const style = statusStyles[item.status];
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start space-x-4 p-4 rounded-xl border ${style.border} ${style.bg} hover:shadow-sm transition-all duration-200`}
          >
            <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
              <item.icon className={`w-4 h-4 ${style.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                  item.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                  item.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{item.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

// Document Status Component
const DocumentStatus = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Document Pipeline</h3>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Filter className="w-4 h-4 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
    
    <div className="space-y-4">
      {[
        { name: "Employment Contract", status: "Under Review", progress: 75, risk: "low", deadline: "2 days" },
        { name: "Partnership Agreement", status: "AI Analysis", progress: 45, risk: "medium", deadline: "5 days" },
        { name: "Service Level Agreement", status: "Pending Approval", progress: 90, risk: "high", deadline: "1 day" },
        { name: "Non-Disclosure Agreement", status: "Draft", progress: 20, risk: "low", deadline: "1 week" },
      ].map((doc, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{doc.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{doc.status}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                doc.risk === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                doc.risk === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {doc.risk} risk
              </span>
              <span className="text-xs text-gray-500">{doc.deadline}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                doc.progress >= 80 ? 'bg-green-500' :
                doc.progress >= 50 ? 'bg-blue-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${doc.progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{doc.progress}% complete</span>
            <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">View Details</button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Welcome back, Alex
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400"
            >
              Here's your legal document analysis overview for today
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 mt-4 lg:mt-0"
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
              {['1d', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <QuickActionButton
              icon={Upload}
              label="Upload Document"
              gradient="bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => {}}
            />
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={FileText}
            label="Documents Analyzed"
            value="247"
            change="+12.5%"
            changeType="up"
            trend="vs last month"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            iconColor="text-white"
          />
          <MetricCard
            icon={Shield}
            label="Risk Assessments"
            value="89"
            change="+8.2%"
            changeType="up"
            trend="high-risk detected: 12"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            iconColor="text-white"
          />
          <MetricCard
            icon={Clock}
            label="Avg. Processing Time"
            value="2.4m"
            change="-15.3%"
            changeType="up"
            trend="faster than average"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            iconColor="text-white"
          />
          <MetricCard
            icon={Users}
            label="Team Collaborations"
            value="34"
            change="+22.1%"
            changeType="up"
            trend="active team members: 8"
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            iconColor="text-white"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Document Status */}
          <div className="lg:col-span-2 space-y-6">
            <DocumentStatus />
            
            {/* AI Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Risks Identified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">156h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            <RecentActivity />
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton
                  icon={Upload}
                  label="New Analysis"
                  gradient="bg-gradient-to-r from-blue-600 to-blue-700"
                  onClick={() => {}}
                />
                <QuickActionButton
                  icon={Eye}
                  label="Review Queue"
                  gradient="bg-gradient-to-r from-purple-600 to-purple-700"
                  onClick={() => {}}
                />
                <QuickActionButton
                  icon={BarChart3}
                  label="Analytics"
                  gradient="bg-gradient-to-r from-green-600 to-green-700"
                  onClick={() => {}}
                />
                <QuickActionButton
                  icon={MessageSquare}
                  label="AI Chat"
                  gradient="bg-gradient-to-r from-orange-600 to-orange-700"
                  onClick={() => {}}
                />
              </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">This Week</h3>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Documents Processed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Risks Identified</span>
                  <span className="font-semibold text-red-600">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time Saved</span>
                  <span className="font-semibold text-green-600">18.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Team Efficiency</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;