import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Mail, Phone, MoreVertical, Shield, Crown } from 'lucide-react';

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Admin',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Legal Reviewer',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
      joinDate: '2024-02-01',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      role: 'Document Manager',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      joinDate: '2024-02-15',
    },
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Legal Reviewer':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Team Management</h1>
          <p className="text-sky-600">Manage team members and their access</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Invite Member
        </motion.button>
      </motion.div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-sky-900">3</p>
            </div>
            <Users className="w-8 h-8 text-sky-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Online Now</p>
              <p className="text-2xl font-bold text-sky-900">2</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Admins</p>
              <p className="text-2xl font-bold text-sky-900">1</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Pending Invites</p>
              <p className="text-2xl font-bold text-sky-900">0</p>
            </div>
            <Mail className="w-8 h-8 text-sky-600" />
          </div>
        </motion.div>
      </div>

      {/* Team Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-sky-100">
          <h2 className="text-xl font-semibold text-sky-900">Team Members</h2>
        </div>

        <div className="divide-y divide-sky-100">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 6) }}
              className="p-6 hover:bg-sky-25 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        member.status === 'online' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}
                    ></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sky-900">{member.name}</h3>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sky-600 text-sm">{member.email}</p>
                    <p className="text-sky-500 text-xs">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-sky-900">{member.role}</p>
                    <p className={`text-xs ${
                      member.status === 'online' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {member.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-white bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg transition-all duration-300 hover:shadow-lg">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg transition-all duration-300 hover:shadow-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transition-all duration-300 hover:shadow-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeamPage;