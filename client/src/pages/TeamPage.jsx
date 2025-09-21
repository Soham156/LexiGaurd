import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Mail, Phone, MoreVertical, Shield, Crown, 
  Search, Filter, UserPlus, Settings, Edit3, Trash2,
  Calendar, MapPin, Clock, Star, Award, TrendingUp,
  MessageSquare, Video, FileText, Activity
} from 'lucide-react';

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Team Lead',
      department: 'Legal',
      avatar: 'SJ',
      status: 'online',
      joinDate: '2024-01-15',
      location: 'New York, NY',
      documentsReviewed: 156,
      lastActive: '2 minutes ago',
      skills: ['Contract Law', 'Compliance', 'Risk Assessment'],
      performance: 98
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Senior Legal Analyst',
      department: 'Legal',
      avatar: 'MC',
      status: 'away',
      joinDate: '2024-02-01',
      location: 'San Francisco, CA',
      documentsReviewed: 89,
      lastActive: '1 hour ago',
      skills: ['Document Analysis', 'Legal Research', 'Due Diligence'],
      performance: 94
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      role: 'Document Manager',
      department: 'Operations',
      avatar: 'EW',
      status: 'online',
      joinDate: '2024-02-15',
      location: 'Chicago, IL',
      documentsReviewed: 203,
      lastActive: 'Just now',
      skills: ['Document Management', 'Process Optimization', 'Quality Control'],
      performance: 96
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.rodriguez@company.com',
      role: 'Compliance Officer',
      department: 'Compliance',
      avatar: 'DR',
      status: 'offline',
      joinDate: '2024-01-20',
      location: 'Austin, TX',
      documentsReviewed: 134,
      lastActive: '3 hours ago',
      skills: ['Regulatory Compliance', 'Risk Management', 'Audit'],
      performance: 92
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      role: 'Legal Researcher',
      department: 'Legal',
      avatar: 'LP',
      status: 'online',
      joinDate: '2024-03-01',
      location: 'Seattle, WA',
      documentsReviewed: 67,
      lastActive: '15 minutes ago',
      skills: ['Legal Research', 'Case Analysis', 'Precedent Review'],
      performance: 90
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Team Lead': return 'from-purple-500 to-pink-500';
      case 'Senior Legal Analyst': return 'from-blue-500 to-cyan-500';
      case 'Document Manager': return 'from-green-500 to-emerald-500';
      case 'Compliance Officer': return 'from-orange-500 to-red-500';
      case 'Legal Researcher': return 'from-indigo-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your team members and their roles</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite Member</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Members', value: teamMembers.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Online Now', value: teamMembers.filter(m => m.status === 'online').length, icon: Activity, color: 'from-green-500 to-emerald-500' },
            { label: 'Documents Reviewed', value: teamMembers.reduce((sum, m) => sum + m.documentsReviewed, 0), icon: FileText, color: 'from-purple-500 to-pink-500' },
            { label: 'Avg Performance', value: `${Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)}%`, icon: TrendingUp, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Roles</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Senior Legal Analyst">Senior Legal Analyst</option>
                <option value="Document Manager">Document Manager</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Legal Researcher">Legal Researcher</option>
              </select>
              
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(member.role)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{member.department}</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {member.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  Last active: {member.lastActive}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{member.documentsReviewed}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Documents</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{member.performance}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Performance</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white ml-1">4.8</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Rating</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {member.skills.slice(0, 2).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {member.skills.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    +{member.skills.length - 2}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Message</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Video className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No team members found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;