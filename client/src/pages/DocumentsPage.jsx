import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentContext } from '../context/DocumentContext';
import { documentService } from '../services/firebaseApi';
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
  ExternalLink,
  FolderOpen,
} from 'lucide-react';

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load documents from Firestore
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Loading documents from Firestore...');
        const result = await documentService.getAll();
        console.log('Documents loaded:', result);
        setDocuments(result.documents || []);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reviewed':
        return (
          <div className="p-1 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        );
      case 'pending':
        return (
          <div className="p-1 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
            <Clock className="w-4 h-4 text-white" />
          </div>
        );
      case 'in_review':
        return (
          <div className="p-1 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="p-1 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg">
            <FileText className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  const getRiskBadge = (riskLevel) => {
    const normalizedRisk = (riskLevel || 'unknown').toLowerCase();
    const colors = {
      low: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg',
      medium: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg',
      high: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg',
      unknown: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold ${colors[normalizedRisk] || colors.unknown} hover:shadow-xl transition-all duration-300`;
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-sky-600">Loading your documents...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-sky-300 mx-auto mb-4" />
          <p className="text-sky-600 text-lg mb-2">No documents found</p>
          <p className="text-sky-500">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
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
                    {getStatusIcon(doc.analysisCompleted ? 'reviewed' : 'pending')}
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-sky-50 rounded">
                    <MoreVertical className="w-4 h-4 text-sky-600" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sky-900 mb-2 line-clamp-2">
                {doc.fileName}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sky-600">Risk Level:</span>
                  <span className={getRiskBadge(doc.analysis?.riskLevel || doc.riskLevel || 'unknown')}>
                    {(doc.analysis?.riskLevel || doc.riskLevel || 'Unknown').charAt(0).toUpperCase() + 
                     (doc.analysis?.riskLevel || doc.riskLevel || 'unknown').slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sky-600">Role:</span>
                  <span className="text-sky-900 font-medium">{doc.selectedRole}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sky-600">Size:</span>
                  <span className="text-sky-900 font-medium">
                    {doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB' : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sky-600">Uploaded:</span>
                  <span className="text-sky-900 font-medium">
                    {doc.uploadDate?.toLocaleDateString?.() || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Google Drive Link */}
              {doc.googleDriveFileId && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Stored in Google Drive</span>
                    </div>
                    <a
                      href={`https://drive.google.com/file/d/${doc.googleDriveFileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

            <div className="flex items-center gap-2 text-xs text-sky-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Uploaded {doc.uploadDate?.toLocaleDateString?.() || 'Unknown'}</span>
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
              {doc.googleDriveFileId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://drive.google.com/file/d/${doc.googleDriveFileId}/view`, '_blank')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Open in Google Drive"
                >
                  <FolderOpen className="w-4 h-4" />
                </motion.button>
              )}
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
      )}

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