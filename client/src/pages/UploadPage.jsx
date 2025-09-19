import React, { useContext, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import { documentService, handleApiError, isAuthenticated } from '../services/api';
import { Shield, Upload, FileText, User, ArrowRight, Loader2 } from 'lucide-react';
import ClauseList from '../components/dashboard/ClauseList';

const UploadPage = () => {
  const { setDocument, setRole, setClauses } = useContext(DocumentContext);
  const [selectedRole, setSelectedRole] = useState('Tenant');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInput = useRef();
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to sign in
      navigate('/signin', { 
        state: { 
          from: '/upload',
          message: 'Please sign in to upload documents' 
        } 
      });
    }
  }, [navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      setIsUploading(true);

      // First, upload the document
      console.log('Uploading document...');
      const uploadResponse = await documentService.upload(
        selectedFile, 
        selectedFile.name, 
        [selectedRole.toLowerCase()]
      );

      console.log('Upload successful:', uploadResponse);
      const documentId = uploadResponse.document.id;

      setIsUploading(false);
      setIsAnalyzing(true);

      // Then, analyze the document
      console.log('Analyzing document...');
      const analysisResponse = await documentService.analyze(documentId);

      console.log('Analysis successful:', analysisResponse);

      // Transform the AI analysis into the format expected by the frontend
      const analysis = analysisResponse.analysis;
      
      // Convert clauses to the format expected by ClauseList component
      const transformedClauses = analysis.clauses?.map((clause, index) => ({
        id: index + 1,
        text: clause.text,
        risk: clause.riskLevel,
        type: clause.type,
        explanation: clause.explanation,
        suggestions: clause.suggestions || []
      })) || [];

      // Set the context data
      setDocument({
        id: documentId,
        name: selectedFile.name,
        analysis: analysis,
        uploadResponse: uploadResponse
      });
      setRole(selectedRole);
      setClauses(transformedClauses);

      // Store analysis results to display on this page
      setAnalysisResults({
        document: {
          id: documentId,
          name: selectedFile.name,
          analysis: analysis
        },
        clauses: transformedClauses
      });

    } catch (error) {
      console.error('Error uploading/analyzing document:', error);
      setError(handleApiError(error, navigate));
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              <span className="text-2xl font-bold text-sky-800 dark:text-sky-300">LexiGuard</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-100">Upload Your Document</h2>
            <p className="text-sky-600 dark:text-sky-400 mt-2">
              Drag and drop your document or click to browse
            </p>
          </motion.div>

          {/* Error Message */}
          {error && !analysisResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Document Info */}
              <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-200 mb-4">Analysis Complete!</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Document</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{analysisResults.document.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      analysisResults.document.analysis.riskLevel === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        : analysisResults.document.analysis.riskLevel === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                      {analysisResults.document.analysis.riskLevel?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{analysisResults.document.analysis.overallScore}/100</p>
                  </div>
                </div>
              </div>

              {/* Clauses */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                <ClauseList 
                  clauses={analysisResults.clauses}
                  onSelect={(id) => console.log('Selected clause:', id)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAnalysisResults(null);
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  Analyze Another Document
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Upload Form - only show when no analysis results */}
          {!analysisResults && (
            <>
              {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-sky-200 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-500'
              }`}
              onClick={() => fileInput.current.click()}
            >
              <input
                type="file"
                ref={fileInput}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragging ? 1.05 : 1 }}
                className="flex flex-col items-center gap-4"
              >
                <Upload className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                {selectedFile ? (
                  <>
                    <FileText className="w-16 h-16 text-sky-600 dark:text-sky-400" />
                    <p className="text-sky-900 dark:text-sky-100 font-medium">{selectedFile.name}</p>
                  </>
                ) : (
                  <p className="text-sky-600 dark:text-sky-400">
                    Drop your file here or click to browse
                  </p>
                )}
                <p className="text-sm text-sky-500 dark:text-sky-400">
                  Supported formats: <strong>PDF, TXT, DOC, DOCX</strong>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-4">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Tenant', 'Landlord', 'Employee', 'Employer', 'Contractor', 'Client'].map(
                (role) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      selectedRole === role
                        ? 'bg-sky-100 dark:bg-sky-900/30 border-2 border-sky-500 dark:border-sky-400'
                        : 'bg-sky-50 dark:bg-gray-700 border-2 border-transparent hover:border-sky-200 dark:hover:border-sky-600'
                    }`}
                  >
                    <User className={`w-5 h-5 ${selectedRole === role ? 'text-sky-600 dark:text-sky-400' : 'text-sky-400 dark:text-sky-500'}`} />
                    <span className={`font-medium ${selectedRole === role ? 'text-sky-900 dark:text-sky-100' : 'text-sky-600 dark:text-sky-300'}`}>
                      {role}
                    </span>
                  </motion.button>
                )
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: selectedFile && !isUploading && !isAnalyzing ? 1.02 : 1 }}
              whileTap={{ scale: selectedFile && !isUploading && !isAnalyzing ? 0.98 : 1 }}
              onClick={handleAnalyze}
              disabled={!selectedFile || isUploading || isAnalyzing}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white transition-colors ${
                selectedFile && !isUploading && !isAnalyzing
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-sky-300 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Document</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPage;
