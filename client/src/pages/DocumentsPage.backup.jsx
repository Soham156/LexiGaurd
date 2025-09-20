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
  const fileInputRef = useRef(null);

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
        
        // Clear success message after 5 seconds
        setTimeout(() => setUploadSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
      } else {
        // For non-PDF files, handle differently
        if (['docx', 'xlsx', 'pptx', 'txt', 'doc'].includes(fileFormat)) {
          // Create download link
          const link = document.createElement('a');
          link.href = viewUrl;
          link.download = properFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // For other files, try to open directly
          window.open(viewUrl, '_blank');
        }
      }
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          `;
          
          const header = document.createElement('div');
          header.style.cssText = `
            padding: 16px 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f8fafc;
            border-radius: 8px 8px 0 0;
          `;
          header.innerHTML = `
            <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">${properFileName}</h3>
            <div style="display: flex; gap: 8px;">
              <button id="downloadPdf" style="
                background: #059669;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
              ">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
              </button>
              <button id="closePdfModal" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
              ">Close</button>
            </div>
          `;
          
          const viewerContainer = document.createElement('div');
          viewerContainer.style.cssText = `
            flex: 1;
            padding: 0;
            overflow: hidden;
            position: relative;
          `;
          
          // Extract public_id from Cloudinary URL and get signed URL
          const urlParts = doc.cloudinaryUrl.split('/');
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          const publicIdParts = urlParts.slice(versionIndex);
          const publicId = publicIdParts.join('/');
          
          // Get signed URL from backend
          const signedUrlResponse = await fetch(
            `http://localhost:8080/api/document/signed-url?publicId=${encodeURIComponent(publicId)}&userId=${encodeURIComponent(auth.currentUser?.uid || '')}`
          );
          
          if (!signedUrlResponse.ok) {
            throw new Error('Failed to get signed URL');
          }
          
          const signedUrlData = await signedUrlResponse.json();
          const signedUrl = signedUrlData.url;
          
          console.log('Using signed URL:', signedUrl);
          
          // Use object tag with signed URL (direct PDF embedding)
          const pdfObject = document.createElement('object');
          pdfObject.data = signedUrl;
          pdfObject.type = 'application/pdf';
          pdfObject.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
          `;
          
          // Add loading message
          viewerContainer.innerHTML = `
            <div id="pdfLoading" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              z-index: 1;
            ">
              <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f4f6;
                border-top: 4px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
              "></div>
              <p style="color: #6b7280; margin: 0;">Loading PDF...</p>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          `;
          
          viewerContainer.appendChild(pdfObject);
          
          // Handle object load
          pdfObject.onload = () => {
            const loading = document.getElementById('pdfLoading');
            if (loading) {
              loading.style.display = 'none';
            }
          };
          
          // Handle object error - show download fallback after timeout
          setTimeout(() => {
            const loading = document.getElementById('pdfLoading');
            if (loading && loading.style.display !== 'none') {
              // If still loading after 5 seconds, assume it failed and show fallback
              viewerContainer.innerHTML = `
                <div style="
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  text-align: center;
                  padding: 40px;
                ">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="margin-bottom: 24px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <h3 style="color: #374151; margin-bottom: 16px;">Unable to Display PDF</h3>
                  <p style="color: #6b7280; margin-bottom: 32px; max-width: 400px;">
                    The PDF cannot be displayed in this browser. Please download the file to view it.
                  </p>
                  <button onclick="
                    const link = document.createElement('a');
                    link.href = '${signedUrl}';
                    link.download = '${properFileName}';
                    link.click();
                  " style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  ">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
              `;
            }
          }, 5000);
          
          content.appendChild(header);
          content.appendChild(viewerContainer);
          modal.appendChild(content);
          document.body.appendChild(modal);
          
          // Download functionality
          document.getElementById('downloadPdf').onclick = () => {
            const link = document.createElement('a');
            link.href = signedUrl;
            link.download = properFileName;
            link.click();
          };
          
          // Close modal functionality
          document.getElementById('closePdfModal').onclick = () => {
            document.body.removeChild(modal);
          };
          
          // Close on background click
          modal.onclick = (e) => {
            if (e.target === modal) {
              document.body.removeChild(modal);
            }
          };
          
        } catch (error) {
          console.warn('Failed to create PDF modal, downloading instead:', error);
          // Final fallback to download via signed URL
          try {
            const urlParts = doc.cloudinaryUrl.split('/');
            const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
            const publicIdParts = urlParts.slice(versionIndex);
            const publicId = publicIdParts.join('/');
            
            const signedUrlResponse = await fetch(
              `http://localhost:8080/api/document/signed-url?publicId=${encodeURIComponent(publicId)}&userId=${encodeURIComponent(auth.currentUser?.uid || '')}`
            );
            
            if (signedUrlResponse.ok) {
              const signedUrlData = await signedUrlResponse.json();
              const link = document.createElement('a');
              link.href = signedUrlData.url;
              link.download = properFileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              throw new Error('Failed to get signed URL for download');
            }
          } catch {
            setUploadError('Unable to access document. Please try again later.');
          }
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
    const notGoogleDrive = !doc.googleDriveFileId; // Exclude Google Drive documents
    return matchesSearch && matchesFilter && notGoogleDrive;
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

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
        className="hidden"
      />

      {/* Upload Success Display */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <p className="text-green-700 text-sm">{uploadSuccess}</p>
        </motion.div>
      )}

      {/* Upload Error Display */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <p className="text-red-700 text-sm">{uploadError}</p>
        </motion.div>
      )}

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
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className={`w-5 h-5 ${uploading ? 'animate-spin' : ''}`} />
              {uploading ? 'Uploading...' : 'Upload Document'}
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

            <div className="flex items-center gap-2 text-xs text-sky-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Uploaded {doc.uploadDate?.toLocaleDateString?.() || 'Unknown'}</span>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewDocument(doc)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteDocument(doc.id)}
                disabled={deleting}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 m-4 max-w-md w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this document? This will permanently remove it from your account.
            </p>
            
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelDelete}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => confirmDeleteDocument(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
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