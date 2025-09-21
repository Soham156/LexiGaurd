import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  MapPin,
  FileText,
  Users,
  Target,
  Shield,
  Upload,
  Search,
  Clock,
  User,
  Download,
  Eye,
  RefreshCw,
  Loader
} from 'lucide-react';
import documentService from '../services/documentService';
import benchmarkService from '../services/benchmarkService';

// Mock benchmark data for demonstration
const mockBenchmarkData = {
  totalContracts: 15420,
  jurisdictions: 23,
  lastUpdated: '2025-09-21',
  popularComparisons: [
    {
      type: 'Rental Agreement',
      count: 8930,
      jurisdiction: 'Maharashtra',
      keyMetrics: {
        securityDeposit: { median: 2, percentile90: 3, unit: 'months' },
        rentIncrease: { median: 5, percentile90: 8, unit: 'percent' },
        noticePeriod: { median: 30, percentile90: 60, unit: 'days' }
      }
    },
    {
      type: 'Employment Contract',
      count: 4200,
      jurisdiction: 'Karnataka',
      keyMetrics: {
        noticePeriod: { median: 30, percentile90: 90, unit: 'days' },
        probationPeriod: { median: 6, percentile90: 12, unit: 'months' },
        nonCompete: { median: 12, percentile90: 24, unit: 'months' }
      }
    },
    {
      type: 'Service Agreement',
      count: 2290,
      jurisdiction: 'Delhi',
      keyMetrics: {
        paymentTerms: { median: 30, percentile90: 45, unit: 'days' },
        terminationNotice: { median: 15, percentile90: 30, unit: 'days' },
        penaltyClause: { median: 5, percentile90: 10, unit: 'percent' }
      }
    }
  ],
  recentInsights: [
    {
      type: 'CAUTION',
      message: 'Security deposits above 3 months are becoming increasingly rare in Mumbai rental agreements.',
      percentage: 95,
      trend: 'decreasing'
    },
    {
      type: 'HIGH-RISK',
      message: 'Tenant-paid maintenance clauses appear in less than 2% of Maharashtra agreements.',
      percentage: 2,
      trend: 'stable'
    },
    {
      type: 'STANDARD',
      message: '5% annual rent increases are the market standard across major Indian cities.',
      percentage: 78,
      trend: 'stable'
    }
  ]
};

const BenchmarkCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
    <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-2">{title}</h4>
  </motion.div>
);

const DocumentCard = ({ document, onSelect, isSelected, onAnalyze, isAnalyzing }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
      isSelected 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}
    onClick={() => onSelect(document)}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {document.fileName || document.originalName}
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{document.selectedRole || 'User'}</span>
          </div>
          {document.riskLevel && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              document.riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
              document.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            }`}>
              {document.riskLevel?.toUpperCase()} RISK
            </span>
          )}
        </div>
      </div>
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(document);
          }}
          disabled={isAnalyzing}
          className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isAnalyzing ? (
            <>
              <Loader className="w-3 h-3 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="w-3 h-3" />
              Analyze Fairness
            </>
          )}
        </button>
      )}
    </div>
  </motion.div>
);

const FairnessResultCard = ({ analysis }) => {
  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'above_average': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'average': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'below_average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'concerning': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Fairness Analysis Results
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getScoreColor(analysis.overallFairnessScore)}`}>
            {analysis.overallFairnessScore}/100
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${getPositionColor(analysis.marketPosition)}`}>
            {analysis.marketPosition?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {analysis.overallAssessment}
      </p>

      {/* Key Findings */}
      {analysis.keyFindings && analysis.keyFindings.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Findings</h4>
          <div className="space-y-3">
            {analysis.keyFindings.slice(0, 3).map((finding, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start gap-2 mb-2">
                  {finding.riskLevel === 'HIGH_RISK' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                  {finding.riskLevel === 'CAUTION' && <Info className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                  {finding.riskLevel === 'STANDARD' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        finding.riskLevel === 'HIGH_RISK' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        finding.riskLevel === 'CAUTION' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      }`}>
                        {finding.riskLevel}
                      </span>
                      {finding.percentile && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {finding.percentile}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {finding.explanation}
                    </p>
                    {finding.recommendation && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        💡 {finding.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmark Metrics */}
      {analysis.benchmarkMetrics && Object.keys(analysis.benchmarkMetrics).length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Market Benchmarks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(analysis.benchmarkMetrics).map(([key, metric]) => (
              <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.assessment?.includes('HIGH_RISK') ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                    metric.assessment?.includes('CAUTION') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {metric.percentile || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>Your contract: <span className="font-medium">{metric.contractValue}</span></div>
                  <div>Market standard: <span className="font-medium">{metric.marketMedian}</span></div>
                  {metric.marketRange && <div>Typical range: <span className="font-medium">{metric.marketRange}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negotiation Opportunities */}
      {analysis.negotiationOpportunities && analysis.negotiationOpportunities.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Negotiation Opportunities
          </h4>
          <div className="space-y-2">
            {analysis.negotiationOpportunities.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    opportunity.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                    opportunity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {opportunity.priority?.toUpperCase()} PRIORITY
                  </span>
                  {opportunity.likelihood && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {opportunity.likelihood} likelihood
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Current:</strong> {opportunity.currentTerm}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Suggested:</strong> {opportunity.suggestedTerm}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {opportunity.justification}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const InsightCard = ({ insight }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'HIGH-RISK':
        return { icon: AlertTriangle, color: 'red', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-800 dark:text-red-300' };
      case 'CAUTION':
        return { icon: Info, color: 'yellow', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-800 dark:text-yellow-300' };
      case 'STANDARD':
        return { icon: CheckCircle, color: 'green', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-800 dark:text-green-300' };
      default:
        return { icon: Info, color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-800 dark:text-blue-300' };
    }
  };

  const { icon: Icon, bgColor, textColor } = getIconAndColor(insight.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${bgColor}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${textColor}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${textColor} bg-white dark:bg-gray-800 border`}>
              {insight.type}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {insight.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonCard = ({ comparison }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{comparison.type}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{comparison.jurisdiction}</span>
          <span>•</span>
          <span>{comparison.count.toLocaleString()} contracts</span>
        </div>
      </div>
      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
    </div>

    <div className="space-y-3">
      {Object.entries(comparison.keyMetrics).map(([key, metric]) => (
        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Median: {metric.median} {metric.unit}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              90th percentile: {metric.percentile90} {metric.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function BenchmarkPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('India');
  const [selectedContractType, setSelectedContractType] = useState('All');
  const [selectedUserRole, setSelectedUserRole] = useState('Consumer');
  
  // Document management state
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fairnessAnalysis, setFairnessAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Load user documents on component mount
  useEffect(() => {
    loadUserDocuments();
  }, []);

  const loadUserDocuments = async () => {
    if (!documentService.isAuthenticated()) {
      return;
    }

    setLoadingDocuments(true);
    try {
      const result = await documentService.getAll();
      if (result.success) {
        setDocuments(result.documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setAnalysisError(null);

    try {
      const result = await benchmarkService.uploadAndAnalyzeFairness(
        file,
        selectedUserRole,
        selectedJurisdiction
      );

      if (result.success) {
        // Refresh documents list
        await loadUserDocuments();
        
        // Set the fairness analysis result
        if (result.fairnessBenchmark) {
          setFairnessAnalysis(result.fairnessBenchmark);
        }
        
        // Select the newly uploaded document
        const newDoc = {
          id: result.documentId,
          fileName: result.fileName,
          uploadDate: new Date(),
          selectedRole: selectedUserRole,
          riskLevel: result.analysis?.riskLevel || 'unknown'
        };
        setSelectedDocument(newDoc);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setAnalysisError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleAnalyzeDocument = async (document) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFairnessAnalysis(null);

    try {
      const result = await benchmarkService.analyzeFairnessById(
        document.id,
        selectedJurisdiction
      );

      if (result.success) {
        setFairnessAnalysis(result.fairnessAnalysis);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Market Fairness Benchmark</h1>
        </div>
        <p className="text-blue-100 text-sm max-w-3xl">
          Compare your contracts against thousands of similar agreements in your jurisdiction. 
          Get unprecedented leverage in negotiations with real market data.
        </p>
      </motion.div>

      {/* Document Analysis Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Analyze Document Fairness
        </h2>
        
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Role
            </label>
            <select
              value={selectedUserRole}
              onChange={(e) => setSelectedUserRole(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Consumer">Consumer</option>
              <option value="Tenant">Tenant</option>
              <option value="Employee">Employee</option>
              <option value="Client">Client</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jurisdiction
            </label>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="India">India</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contract Type Filter
            </label>
            <select
              value={selectedContractType}
              onChange={(e) => setSelectedContractType(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Contract Types</option>
              <option value="Rental Agreement">Rental Agreement</option>
              <option value="Employment Contract">Employment Contract</option>
              <option value="Service Agreement">Service Agreement</option>
              <option value="Vendor Agreement">Vendor Agreement</option>
            </select>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Upload New Document</h3>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Document Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Or Select from Your Documents</h3>
            <button
              onClick={loadUserDocuments}
              disabled={loadingDocuments}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loadingDocuments ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loadingDocuments ? (
            <div className="text-center py-8">
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">Loading your documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No documents found. Upload your first document to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  isSelected={selectedDocument?.id === document.id}
                  onSelect={setSelectedDocument}
                  onAnalyze={handleAnalyzeDocument}
                  isAnalyzing={isAnalyzing && selectedDocument?.id === document.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {analysisError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Analysis Error</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{analysisError}</p>
          </motion.div>
        )}

        {/* Analysis Results */}
        {fairnessAnalysis && (
          <FairnessResultCard analysis={fairnessAnalysis} />
        )}
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BenchmarkCard
          title="Total Contracts Analyzed"
          value={mockBenchmarkData.totalContracts.toLocaleString()}
          subtitle="Across all jurisdictions"
          icon={FileText}
          color="blue"
        />
        <BenchmarkCard
          title="Jurisdictions Covered"
          value={mockBenchmarkData.jurisdictions}
          subtitle="States and territories"
          icon={MapPin}
          color="green"
        />
        <BenchmarkCard
          title="Last Updated"
          value="Today"
          subtitle={`${mockBenchmarkData.lastUpdated}`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recent Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Latest Market Insights
        </h2>
        <div className="space-y-3">
          {mockBenchmarkData.recentInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </motion.div>

      {/* Popular Comparisons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Popular Contract Comparisons
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockBenchmarkData.popularComparisons.map((comparison, index) => (
            <ComparisonCard key={index} comparison={comparison} />
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          How Market Fairness Benchmark Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Select or Upload Contract</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose from your existing documents or upload a new contract for analysis.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">AI-Powered Fairness Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our AI compares your terms against thousands of similar contracts in your jurisdiction.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Get Negotiation Leverage</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive specific insights and talking points to negotiate better terms.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}