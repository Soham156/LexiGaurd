import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-sky-600 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-sky-900">{value}</h3>
        {trend && (
          <p className={`text-sm mt-1 ${color}`}>
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-full bg-sky-50`}>
        <Icon className="w-6 h-6 text-sky-600" />
      </div>
    </div>
  </motion.div>
);

const RecentActivity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <h3 className="text-lg font-semibold text-sky-900 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {[
        {
          icon: FileText,
          title: "Contract Review Completed",
          time: "2 hours ago",
          description: "Employment Agreement review completed",
        },
        {
          icon: AlertTriangle,
          title: "Risk Alert",
          time: "5 hours ago",
          description: "High-risk clause detected in NDA",
        },
        {
          icon: CheckCircle,
          title: "Document Approved",
          time: "1 day ago",
          description: "Service Agreement approved by legal team",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-4"
        >
          <div className="p-2 rounded-full bg-sky-50">
            <item.icon className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <p className="font-medium text-sky-900">{item.title}</p>
            <p className="text-sm text-sky-600">{item.time}</p>
            <p className="text-sm text-sky-700 mt-1">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-sky-900"
        >
          Welcome back, User
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sky-600"
        >
          Here's what's happening with your documents today.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="Active Documents"
          value="12"
          trend="+2.5% this week"
          color="text-green-500"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value="8"
          trend="Active now"
          color="text-sky-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Reviews"
          value="5"
          trend="3 urgent"
          color="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-semibold text-sky-900 mb-4">
            Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {['Contract Review', 'Team Meeting', 'Document Submission'].map(
              (item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-sky-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-sky-600" />
                    <span className="font-medium text-sky-900">{item}</span>
                  </div>
                  <span className="text-sm text-sky-600">Tomorrow</span>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;