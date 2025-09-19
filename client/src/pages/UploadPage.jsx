import React, { useContext, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import { Shield, Upload, FileText, User, ArrowRight } from 'lucide-react';

const UploadPage = () => {
  const { setDocument, setRole, setClauses } = useContext(DocumentContext);
  const [selectedRole, setSelectedRole] = useState('Tenant');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef();
  const navigate = useNavigate();

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

  const handleAnalyze = () => {
    // Mock clauses
    setClauses([
      { id: 1, text: 'Tenant must pay rent on the 1st', risk: 'low' },
      { id: 2, text: 'Landlord may enter at any time', risk: 'high' },
      { id: 3, text: 'Lease auto-renews unless 30d notice', risk: 'medium' },
    ]);
    setRole(selectedRole);
    setDocument({ name: selectedFile?.name || 'Sample Agreement' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-sky-600" />
              <span className="text-2xl font-bold text-sky-800">LexiGuard</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-sky-900">Upload Your Document</h2>
            <p className="text-sky-600 mt-2">
              Drag and drop your document or click to browse
            </p>
          </motion.div>

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
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-sky-200 hover:border-sky-400'
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
                <Upload className="w-12 h-12 text-sky-500" />
                {selectedFile ? (
                  <>
                    <FileText className="w-16 h-16 text-sky-600" />
                    <p className="text-sky-900 font-medium">{selectedFile.name}</p>
                  </>
                ) : (
                  <p className="text-sky-600">
                    Drop your file here or click to browse
                  </p>
                )}
                <p className="text-sm text-sky-500">
                  Supported formats: PDF, DOC, DOCX, TXT
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
            <label className="block text-sm font-medium text-sky-700 mb-4">
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
                        ? 'bg-sky-100 border-2 border-sky-500'
                        : 'bg-sky-50 border-2 border-transparent hover:border-sky-200'
                    }`}
                  >
                    <User className={`w-5 h-5 ${selectedRole === role ? 'text-sky-600' : 'text-sky-400'}`} />
                    <span className={`font-medium ${selectedRole === role ? 'text-sky-900' : 'text-sky-600'}`}>
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={!selectedFile}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white transition-colors ${
                selectedFile
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-sky-300 cursor-not-allowed'
              }`}
            >
              <span>Analyze Document</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPage;
