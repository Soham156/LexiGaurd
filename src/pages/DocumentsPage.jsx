import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentContext } from '../context/DocumentContext';
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const DocumentsPage = () => {
  const { clauses, document } = useContext(DocumentContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: 'Employment Agreement - John Doe',
      status: 'reviewed',
      uploadDate: '2025-01-15',
      lastModified: '2025-01-16',
      riskLevel: 'low',
      clauses: 12,
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'Lease Agreement - Apartment 4B',
      status: 'pending',
      uploadDate: '2025-01-14',
      lastModified: '2025-01-14',
      riskLevel: 'high',
      clauses: 8,
      size: '1.8 MB',
    },
    {
      id: 3,
      name: 'Service Contract - ABC Corp',
      status: 'in_review',
      uploadDate: '2025-01-13',
      lastModified: '2025-01-15',
      riskLevel: 'medium',
      clauses: 15,
      size: '3.1 MB',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reviewed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_review':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskBadge = (riskLevel) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel]}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-sky-900 mb-2">Documents</h1>
        <p className="text-sky-600">Manage and review your legal documents</p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Document
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 rounded-lg">
                  <FileText className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  {getStatusIcon(doc.status)}
                </div>
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-sky-50 rounded">
                  <MoreVertical className="w-4 h-4 text-sky-600" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-sky-900 mb-2 line-clamp-2">
              {doc.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sky-600">Risk Level:</span>
                <span className={getRiskBadge(doc.riskLevel)}>
                  {doc.riskLevel.charAt(0).toUpperCase() + doc.riskLevel.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sky-600">Clauses:</span>
                <span className="text-sky-900 font-medium">{doc.clauses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sky-600">Size:</span>
                <span className="text-sky-900 font-medium">{doc.size}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-sky-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Modified {doc.lastModified}</span>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-sky-900">3</p>
            </div>
            <FileText className="w-8 h-8 text-sky-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-sky-900">1</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">High Risk</p>
              <p className="text-2xl font-bold text-sky-900">1</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sky-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-sky-900">1</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentsPage;