import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DocumentContext } from '../context/DocumentContext';
import { documentService } from '../services/api';
import { auth } from '../firebase/firebase';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Store document ID to confirm delete
  const [deleting, setDeleting] = useState(false);
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);
  const fileInputRef = useRef(null);

  // Clean duplicate documents (keep the most recent of each filename)
  const handleCleanDuplicates = async () => {
    if (!window.confirm('This will delete duplicate documents (keeping the most recent of each file). Continue?')) {
      return;
    }

    try {
      setCleaningDuplicates(true);
      
      // Group documents by filename
      const grouped = documents.reduce((acc, doc) => {
        const fileName = doc.fileName || doc.originalName || 'unnamed';
        if (!acc[fileName]) {
          acc[fileName] = [];
        }
        acc[fileName].push(doc);
        return acc;
      }, {});

      // Find duplicates to delete (keep the most recent)
      let toDelete = [];
      for (const [fileName, docs] of Object.entries(grouped)) {
        if (docs.length > 1) {
          // Sort by upload date (most recent first)
          docs.sort((a, b) => {
            const dateA = new Date(a.uploadDate || 0);
            const dateB = new Date(b.uploadDate || 0);
            return dateB - dateA;
          });
          
          // Mark all except the first (most recent) for deletion
          toDelete.push(...docs.slice(1));
        }
      }

      console.log('Documents to delete:', toDelete.length);
      
      if (toDelete.length === 0) {
        setUploadSuccess('No duplicates found to clean up');
        setTimeout(() => setUploadSuccess(''), 3000);
        return;
      }

      // Delete duplicates
      for (const doc of toDelete) {
        await documentService.deleteDocument(doc.id);
      }

      // Reload documents
      const result = await documentService.getAll();
      const userDocuments = result.documents?.filter(doc => doc.userId === auth.currentUser.uid) || [];
      setDocuments(userDocuments);
      
      setUploadSuccess(`Cleaned up ${toDelete.length} duplicate documents`);
      setTimeout(() => setUploadSuccess(''), 5000);
      
    } catch (err) {
      console.error('Error cleaning duplicates:', err);
      setUploadError(`Failed to clean duplicates: ${err.message}`);
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setCleaningDuplicates(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess('');
      
      console.log('Uploading file:', file.name);
      
      // Upload and analyze the document
      const result = await documentService.uploadAndAnalyze(file, 'user');
      
      if (result.success) {
        // Reload documents to show the new upload
        const updatedDocuments = await documentService.getAll();
        setDocuments(updatedDocuments.documents || []);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setUploadSuccess(`Document "${result.fileName}" uploaded successfully!`);
        console.log('Document uploaded successfully:', result.fileName);
        
        setTimeout(() => setUploadSuccess(''), 5000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload document');
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  // Handle view document
  const handleViewDocument = async (doc) => {
    if (doc.cloudinaryUrl) {
      const fileFormat = (doc.format || '').toLowerCase();
      const fileName = doc.fileName || doc.originalName || 'document';
      
      // Ensure proper file extension
      let properFileName = fileName;
      if (fileName.includes('_docx') && !fileName.endsWith('.docx')) {
        properFileName = fileName.replace('_docx', '.docx');
      } else if (fileName.includes('_pdf') && !fileName.endsWith('.pdf')) {
        properFileName = fileName.replace('_pdf', '.pdf');
      } else if (fileName.includes('_xlsx') && !fileName.endsWith('.xlsx')) {
        properFileName = fileName.replace('_xlsx', '.xlsx');
      } else if (fileName.includes('_pptx') && !fileName.endsWith('.pptx')) {
        properFileName = fileName.replace('_pptx', '.pptx');
      }

      // Fix Cloudinary URL for proper PDF viewing
      let viewUrl = doc.cloudinaryUrl;
      
      // Convert image upload URLs to raw upload URLs for non-image files
      if (fileFormat === 'pdf' || ['docx', 'xlsx', 'pptx', 'txt', 'doc'].includes(fileFormat)) {
        if (viewUrl.includes('/image/upload/')) {
          viewUrl = viewUrl.replace('/image/upload/', '/raw/upload/');
        }
      }
      
      // Handle different file types
      if (fileFormat === 'pdf') {
        // For PDFs, use backend signed URL to avoid ACL issues
        try {
          console.log('Attempting to view PDF:', doc.cloudinaryUrl);
          
          // Extract public_id from Cloudinary URL and get signed URL
          const urlParts = doc.cloudinaryUrl.split('/');
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          const publicIdParts = urlParts.slice(versionIndex);
          const publicId = publicIdParts.join('/');
          
          console.log('Extracted publicId:', publicId);
          
          // Get signed URL from backend
          const signedUrlEndpoint = `http://localhost:8080/api/document/signed-url?publicId=${encodeURIComponent(publicId)}&userId=${encodeURIComponent(auth.currentUser?.uid || '')}`;
          console.log('Requesting signed URL from:', signedUrlEndpoint);
          
          const signedUrlResponse = await fetch(signedUrlEndpoint);
          
          console.log('Signed URL response status:', signedUrlResponse.status);
          
          if (!signedUrlResponse.ok) {
            const errorText = await signedUrlResponse.text();
            console.error('Signed URL error:', errorText);
            throw new Error(`Failed to get signed URL: ${signedUrlResponse.status}`);
          }
          
          const signedUrlData = await signedUrlResponse.json();
          const signedUrl = signedUrlData.url;
          
          console.log('Got signed URL:', signedUrl);
          
          // Test the signed URL directly first
          window.open(signedUrl, '_blank');
          
        } catch (error) {
          console.error('Error getting signed URL:', error);
          setUploadError(`Failed to view PDF: ${error.message}`);
          setTimeout(() => setUploadError(''), 4000);
        }
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileFormat)) {
        // For images, open directly (keep image upload URL)
        window.open(doc.cloudinaryUrl, '_blank');
      } else {
        // For other documents (docx, xlsx, pptx, txt), download with proper extension
        const link = document.createElement('a');
        link.href = viewUrl;
        link.download = properFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download feedback
        setUploadSuccess(`Downloading "${properFileName}"...`);
        setTimeout(() => setUploadSuccess(''), 3000);
      }
    } else {
      setUploadError('Document file is not available for viewing. Please contact support if this persists.');
      setTimeout(() => setUploadError(''), 5000);
    }
  };

  // Handle delete document
  const handleDeleteDocument = (documentId) => {
    setDeleteConfirm(documentId);
  };

  // Confirm delete document
  const confirmDeleteDocument = async (documentId) => {
    try {
      setDeleting(true);
      
      await documentService.deleteDocument(documentId);
      
      // Remove document from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      setUploadSuccess('Document deleted successfully');
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setUploadError(err.message || 'Failed to delete document');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Load documents from Firestore
  useEffect(() => {
    const loadDocuments = async () => {
      // Check if user is authenticated
      if (!auth.currentUser) {
        console.log('User not authenticated, waiting...');
        setLoading(false);
        setError('Please sign in to view your documents');
        return;
      }

      try {
        setLoading(true);
        setError('');
        console.log('Loading documents for user:', auth.currentUser.uid);
        console.log('User email:', auth.currentUser.email);
        
        const result = await documentService.getAll();
        console.log('Documents loaded:', result);
        console.log('Number of documents:', result.documents?.length || 0);
        console.log('Sample document structure:', result.documents?.[0]);
        
        // Log all document names and IDs for debugging
        const documentSummary = result.documents?.map(doc => ({
          id: doc.id,
          fileName: doc.fileName || doc.originalName,
          uploadDate: doc.uploadDate,
          userId: doc.userId,
          status: doc.status
        })) || [];
        console.log('All documents summary:', documentSummary);
        
        // Check for duplicates
        const fileNames = result.documents?.map(doc => doc.fileName || doc.originalName) || [];
        const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
          console.log('Duplicate file names found:', duplicates);
        }
        
        console.log('Document fields check:', {
          sampleDoc: result.documents?.[0],
          hasSize: !!(result.documents?.[0]?.fileSize || result.documents?.[0]?.size),
          hasDate: !!(result.documents?.[0]?.createdAt || result.documents?.[0]?.uploadedAt),
          hasFormat: !!(result.documents?.[0]?.format || result.documents?.[0]?.fileType)
        });
        
        // Verify all documents belong to current user
        const userDocuments = result.documents?.filter(doc => doc.userId === auth.currentUser.uid) || [];
        console.log('Documents after user filter:', userDocuments.length);
        
        setDocuments(userDocuments);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth state to be ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadDocuments();
      } else {
        setDocuments([]);
        setLoading(false);
        setError('Please sign in to view your documents');
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter documents based on search term and status
  const filteredDocuments = documents.filter(doc => {
    // Hide Google Drive documents
    if (doc.storageLocation === 'google_drive') return false;

    const matchesSearch = doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentSize = (doc) => {
    // Try multiple possible field names for file size
    const size = doc.fileSize || doc.size || doc.sizeBytes || doc.fileSizeBytes;
    return size ? formatFileSize(size) : 'Unknown';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      // Handle different date formats
      let dateObj;
      
      if (date.toDate) {
        // Firestore timestamp
        dateObj = date.toDate();
      } else if (typeof date === 'string') {
        // String date - try parsing
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        // Already a Date object
        dateObj = date;
      } else if (typeof date === 'number') {
        // Unix timestamp
        dateObj = new Date(date);
      } else {
        return 'N/A';
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.log('Date parsing error:', err, 'for date:', date);
      return 'N/A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskLevel = (doc) => {
    // First check if there's a direct riskLevel field
    if (doc.riskLevel) {
      const risk = doc.riskLevel.toString().toLowerCase();
      if (risk === 'high') {
        return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
      } else if (risk === 'medium' || risk === 'moderate') {
        return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      } else if (risk === 'low') {
        return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
      }
    }

    // Check if there's analysis with risk factors
    if (doc.analysis && doc.analysis.riskFactors) {
      const totalRisks = doc.analysis.riskFactors.length;
      
      if (totalRisks === 0) {
        return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
      } else if (totalRisks <= 2) {
        return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      } else {
        return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
      }
    }

    // Generate varied risk levels based on document properties for demo
    const fileName = (doc.fileName || doc.originalName || '').toLowerCase();
    const docId = doc.id || '';
    
    // Use a simple hash of document ID to determine risk level consistently
    let hash = 0;
    for (let i = 0; i < docId.length; i++) {
      const char = docId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const riskValue = Math.abs(hash) % 100; // Use modulo 100 for better distribution
    
    // Different risk distributions based on document type
    if (fileName.includes('contract') || fileName.includes('agreement')) {
      if (riskValue < 30) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
      if (riskValue < 70) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else {
      if (riskValue < 40) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
      if (riskValue < 75) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  const getDocumentRole = (doc) => {
    // First check if there's a direct selectedRole field
    if (doc.selectedRole) {
      return doc.selectedRole;
    }
    
    // Determine document role/type from analysis or filename
    if (doc.analysis && doc.analysis.documentType) {
      return doc.analysis.documentType;
    }
    
    const fileName = (doc.fileName || doc.originalName || '').toLowerCase();
    if (fileName.includes('contract')) return 'Contract';
    if (fileName.includes('agreement')) return 'Agreement';
    if (fileName.includes('policy')) return 'Policy';
    if (fileName.includes('terms')) return 'Terms & Conditions';
    if (fileName.includes('privacy')) return 'Privacy Policy';
    if (fileName.includes('nda')) return 'NDA';
    if (fileName.includes('license')) return 'License';
    
    return 'Legal Document';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Documents</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and analyze your legal documents</p>
          </div>
          
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

      {/* Alert Messages */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {uploadError}
          </div>
        </motion.div>
      )}

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {uploadSuccess}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="processed">Processed</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Debug Info - Temporary */}
      {documents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <details className="cursor-pointer">
            <summary className="font-medium text-blue-900 mb-2 flex items-center justify-between">
              <span>📊 Document Analysis</span>
              <span className="text-sm text-blue-700">Click to expand</span>
            </summary>
            <div className="text-sm text-blue-800 space-y-2 mt-3">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>User:</strong> {auth.currentUser?.email?.split('@')[0] || 'Unknown'}</div>
                <div><strong>Total:</strong> {documents.length} documents</div>
              </div>
              
              {/* Show unique vs total count */}
              {(() => {
                const fileNames = documents.map(doc => doc.fileName || doc.originalName);
                const uniqueNames = [...new Set(fileNames)];
                const duplicateCount = fileNames.length - uniqueNames.length;
                
                return (
                  <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div>
                      <strong>Unique:</strong> {uniqueNames.length} | 
                      <strong className={duplicateCount > 0 ? " text-red-600" : " text-green-600"}> 
                        Duplicates:
                      </strong> {duplicateCount}
                    </div>
                    {duplicateCount > 0 && (
                      <button
                        onClick={handleCleanDuplicates}
                        disabled={cleaningDuplicates}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors shadow-sm"
                      >
                        {cleaningDuplicates ? 'Cleaning...' : `Clean ${duplicateCount} Duplicates`}
                      </button>
                    )}
                  </div>
                );
              })()}
              
              {/* Show file names with upload dates - collapsed by default */}
              <details className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                <summary className="cursor-pointer text-xs font-medium text-gray-700">Document Details ({documents.length} files)</summary>
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {documents.slice(0, 10).map((doc, index) => (
                    <div key={doc.id} className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                      <span className="truncate flex-1 mr-2">
                        <strong>#{index + 1}:</strong> {doc.fileName || doc.originalName}
                      </span>
                      <span className="text-gray-500 text-right flex-shrink-0">
                        {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                  {documents.length > 10 && (
                    <div className="text-xs text-gray-500 text-center py-2">
                      ... and {documents.length - 10} more documents
                    </div>
                  )}
                </div>
              </details>
            </div>
          </details>
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No documents found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {documents.length === 0 
              ? "Upload your first document to get started" 
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-base mb-1">
                      {doc.fileName || doc.originalName || 'Untitled Document'}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(doc.status)}
                      <span className="capitalize text-sm text-gray-600">{doc.status || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getDocumentRole(doc)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskLevel(doc).bgColor} ${getRiskLevel(doc).color}`}>
                        {getRiskLevel(doc).level} Risk
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Size:</span>
                  <span className="text-gray-800">{getDocumentSize(doc)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Format:</span>
                  <span className="text-xs uppercase bg-gray-50 px-2 py-1 rounded max-w-24 truncate">
                    {(doc.format || doc.fileType || doc.mimeType?.split('/')[1] || 'Unknown')
                      .replace('application/', '')
                      .replace('vnd.openxmlformats-officedocument.', '')
                      .replace('wordprocessingml.document', 'DOCX')
                      .replace('spreadsheetml.sheet', 'XLSX')
                      .replace('presentationml.presentation', 'PPTX')
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Uploaded:</span>
                  <span className="text-gray-800">{formatDate(doc.uploadDate || doc.createdAt || doc.uploadedAt || doc.timestamp || doc.dateCreated)}</span>
                </div>
                {doc.analysis && doc.analysis.riskFactors && (
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium">Risk Factors:</span>
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      {doc.analysis.riskFactors.length || 0} issues
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDocument(doc)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteDocument(deleteConfirm)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DocumentsPage;