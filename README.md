# LexiGuard - AI-Powered Legal Document Analysis Platform

LexiGuard is an advanced AI-powered legal document analysis platform that provides comprehensive legal document analysis, compliance checking, risk assessment, and fairness benchmarking. Built with cutting-edge technology to help individuals and businesses make informed legal decisions.

## 🚀 Key Features

### 📄 Document Analysis & Processing

- **Multi-Format Support**: Upload PDF, Word documents (.doc, .docx), text files (.txt), PowerPoint (.pptx), Excel (.xlsx), and images with text
- **Advanced Text Extraction**: Intelligent content extraction from various document formats
- **File Validation**: Comprehensive file validation including size limits (10MB), type checking, and content verification
- **Secure Cloud Storage**: Documents stored securely on Cloudinary with automatic cleanup
- **Real-time Processing**: Instant document analysis with progress tracking

### 🤖 AI-Powered Analysis

- **Google Gemini AI Integration**: Leverages advanced large language models for comprehensive analysis
- **Multi-Role Analysis**: Tailored analysis based on user role (Tenant, Landlord, Employee, Client, Consumer, etc.)
- **Document Type Detection**: Automatically identifies contract types and relevant legal frameworks
- **Key Clause Extraction**: Identifies critical legal clauses, terms, and conditions
- **Risk Assessment**: Comprehensive risk evaluation with color-coded risk levels (Low, Medium, High)
- **Compliance Checking**: Automated compliance verification against regulatory requirements
- **Issue Detection**: Identifies potential legal problems and areas of concern

### 📊 Market Fairness Benchmark

- **Comparative Analysis**: Compare contract terms against thousands of similar agreements
- **Jurisdiction-Specific Benchmarks**: Analysis tailored to specific regions (India, Maharashtra, Karnataka, Delhi, etc.)
- **Market Position Assessment**: Understand if your terms are above average, average, below average, or concerning
- **Fairness Scoring**: Get quantitative fairness scores (0-100) for your contracts
- **Negotiation Opportunities**: Receive specific recommendations for contract improvements
- **Market Insights**: Access to real-time market trends and industry standards

### 💬 Intelligent Chat Assistant

- **Document-Aware Conversations**: Chat about specific documents with full context awareness
- **What-If Scenario Analysis**: Explore hypothetical situations and their legal implications
- **Multi-Modal Communication**: Support for text, file uploads, and rich formatting
- **Quick Actions**: One-click access to common analysis tasks
- **Contextual Responses**: AI responses formatted with risk indicators and actionable insights
- **Real-time Analysis**: Live document processing during conversations

### 📈 Dashboard & Analytics

- **Comprehensive Dashboard**: Overview of document analytics, team activity, and key metrics
- **Document Management**: Centralized document library with search and filtering
- **Activity Tracking**: Monitor recent activities, pending reviews, and upcoming deadlines
- **Risk Analytics**: Visual representation of risk distribution across documents
- **Team Collaboration**: Multi-user support with role-based access control

### 🔐 Security & Authentication

- **Firebase Authentication**: Secure user authentication with email/password and social logins
- **User Access Control**: Role-based permissions and document ownership verification
- **Secure File Handling**: End-to-end encryption for file uploads and storage
- **CORS Protection**: Comprehensive CORS configuration for secure API access
- **Input Sanitization**: Protection against malicious content and injection attacks

## 🛠 Technology Stack

### Frontend

- **React 18** - Modern component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Framer Motion** - Advanced animations and micro-interactions
- **Firebase SDK** - Authentication, Firestore database, and real-time features
- **Lucide React** - Modern icon library
- **React Markdown** - Rich text formatting for AI responses
- **React Router** - Client-side routing and navigation

### Backend

- **Node.js & Express** - Server runtime and web framework
- **Multer** - Multipart file upload handling
- **Cloudinary** - Cloud-based file storage and media management
- **PDF-Parse** - PDF text extraction
- **Mammoth** - Word document (.docx) text extraction
- **Google Gemini AI** - Advanced language model for document analysis
- **Firebase Admin SDK** - Server-side user verification and database operations
- **CORS** - Cross-origin resource sharing configuration

### Database & Storage

- **Firebase Firestore** - NoSQL document database for user data and metadata
- **Cloudinary** - Secure cloud storage for document files
- **Firebase Authentication** - User authentication and session management

### AI & Analytics

- **Google Gemini Pro** - Large language model for document analysis
- **Custom Fairness Benchmark Engine** - Proprietary algorithm for market comparison
- **Risk Assessment Models** - AI-powered risk evaluation systems
- **What-If Simulation Engine** - Scenario analysis and prediction

## 📋 Prerequisites

Before running LexiGuard, ensure you have:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Cloudinary Account** - [Sign up here](https://cloudinary.com/)
- **Firebase Project** - [Create project here](https://console.firebase.google.com/)
- **Google AI Studio API Key** - [Get API key here](https://aistudio.google.com/)

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 1GB free space
- **OS**: Windows 10+, macOS 10.14+, or Ubuntu 18.04+
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Soham156/LexiGuard.git
cd LexiGuard
```

### 2. Backend Setup

```bash
cd server
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Cloudinary Configuration (Required)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Google Gemini AI Configuration (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomainhere.com

# Firebase Admin SDK (Optional - for advanced features)
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Create environment file
cp .env.example .env.local
```

Configure your `.env.local` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=LexiGuard

# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Additional Configuration
VITE_ENVIRONMENT=development
VITE_ENABLE_ANALYTICS=false
```

### 4. External Services Setup

#### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Navigate to your Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Configure automatic folder creation and media transformations
5. Set up upload presets for different file types

#### Google Gemini AI Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing one
3. Enable the Gemini API
4. Generate an API key with appropriate permissions
5. Set up usage quotas and billing (if required)

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the following services:
   - **Authentication** (Email/Password, Google, GitHub)
   - **Firestore Database** (in production mode)
   - **Storage** (for additional file handling)
4. Create a web app and copy the configuration
5. Set up security rules for Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /document_shares/{share} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.ownerUserId ||
         request.auth.token.email == resource.data.sharedWithEmail);
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerUserId;
    }
  }
}
```

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:8080`

#### Start the Frontend Application

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### Production Mode

#### Build the Frontend

```bash
cd client
npm run build
```

#### Deploy to Vercel (Backend)

```bash
cd server
vercel --prod
```

#### Deploy to Netlify/Vercel (Frontend)

```bash
cd client
npm run build
# Upload dist/ folder to your hosting provider
```

## 📁 Project Structure

```
LexiGuard/
├── client/                     # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (Button, etc.)
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── Header.jsx     # Main navigation header
│   │   │   └── Footer.jsx     # Application footer
│   │   ├── pages/             # Route components
│   │   │   ├── Dashboard.jsx      # Main dashboard page
│   │   │   ├── BenchmarkPage.jsx  # Fairness benchmark analysis
│   │   │   ├── ChatPage.jsx       # AI chat interface
│   │   │   ├── DocumentsPage.jsx  # Document management
│   │   │   ├── SettingsPage.jsx   # User settings
│   │   │   ├── LandingPage.jsx    # Marketing/landing page
│   │   │   ├── SignIn.jsx         # Authentication
│   │   │   └── SignUp.jsx         # User registration
│   │   ├── services/          # API and external service integrations
│   │   │   ├── api.js             # Base API configuration
│   │   │   ├── documentService.js # Document CRUD operations
│   │   │   └── benchmarkService.js # Fairness benchmarking
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   ├── DocumentContext.jsx # Document state management
│   │   │   └── ThemeContext.jsx   # UI theme management
│   │   ├── firebase/          # Firebase configuration
│   │   │   ├── firebase.js        # Firebase initialization
│   │   │   └── auth.js            # Authentication helpers
│   │   ├── layouts/           # Page layout components
│   │   │   ├── DashboardLayout.jsx # Dashboard wrapper
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   └── utils/             # Utility functions
│   │       └── errorHandler.js    # Error handling utilities
│   ├── tailwind.config.cjs    # Tailwind CSS configuration
│   ├── vite.config.js         # Vite build configuration
│   └── package.json           # Frontend dependencies
├── server/                     # Node.js backend application
│   ├── routes/                # API endpoint definitions
│   │   ├── documentRoutes.js      # Document upload/analysis endpoints
│   │   ├── chatRoutes.js          # AI chat endpoints
│   │   ├── benchmarkRoutes.js     # Fairness benchmark endpoints
│   │   └── chat.js               # Legacy chat routes
│   ├── services/              # Business logic services
│   │   ├── documentAnalysisService.js  # Core document analysis
│   │   ├── fairnessBenchmarkService.js # Market benchmarking
│   │   ├── geminiService.js           # Google Gemini AI integration
│   │   └── whatIfSimulatorService.js  # Scenario simulation
│   ├── config/                # Configuration files
│   │   └── cloudinary.js          # Cloudinary setup
│   ├── middleware/            # Express middleware
│   ├── utils/                 # Utility functions
│   │   └── textExtractor.js       # Text extraction from files
│   ├── temp/                  # Temporary file storage
│   ├── vercel.json            # Vercel deployment configuration
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies
├── README.md                   # Project documentation
└── .gitignore                 # Git ignore rules
```

## 🔐 Security Features

- **Multi-Layer File Validation**: File type, size, and content validation
- **Secure File Upload**: Virus scanning and malicious content detection
- **User Authentication**: Firebase-based secure authentication with session management
- **Document Ownership Verification**: Users can only access their own documents
- **API Rate Limiting**: Protection against abuse and denial-of-service attacks
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Sanitization**: Protection against injection attacks and malicious content
- **Secure Cloud Storage**: Encrypted file storage with access controls
- **Privacy Compliance**: GDPR and data protection compliance measures

## 📊 Supported File Formats & Specifications

### Document Types

- **PDF Documents** (.pdf) - Up to 10MB

  - Text-based PDFs with OCR support
  - Multi-page document processing
  - Metadata extraction and analysis

- **Microsoft Word** (.docx, .doc) - Up to 10MB

  - Rich text formatting preservation
  - Table and image content extraction
  - Comment and revision tracking

- **Text Files** (.txt) - Up to 10MB

  - Plain text with encoding detection
  - Large file chunking support
  - Character encoding validation

- **PowerPoint** (.pptx, .ppt) - Up to 10MB _(Chat interface only)_

  - Slide content extraction
  - Speaker notes analysis
  - Embedded object handling

- **Excel Spreadsheets** (.xlsx, .xls) - Up to 10MB _(Chat interface only)_

  - Multi-sheet processing
  - Formula and data analysis
  - Chart and graph interpretation

- **Images with Text** (.jpg, .png) - Up to 10MB _(Chat interface only)_
  - OCR text extraction
  - Document image processing
  - Handwriting recognition

### Processing Capabilities

- **Batch Processing**: Multiple documents simultaneously
- **Incremental Analysis**: Progressive document processing
- **Error Recovery**: Robust handling of corrupted or partial files
- **Format Detection**: Automatic file type identification
- **Content Validation**: Verification of document integrity

## 🤖 AI Analysis Features

### Document Understanding

- **Automated Document Classification**: Identifies contract types, legal documents, and business agreements
- **Entity Recognition**: Extracts parties, dates, amounts, and key terms
- **Clause Categorization**: Organizes content by legal significance and type
- **Cross-Reference Analysis**: Identifies related clauses and dependencies
- **Terminology Extraction**: Legal and technical term identification

### Risk Assessment Engine

- **Multi-Dimensional Risk Scoring**: Financial, legal, operational, and compliance risks
- **Severity Classification**: Risk levels from negligible to critical
- **Impact Analysis**: Potential consequences and likelihood assessment
- **Mitigation Recommendations**: Specific actions to reduce identified risks
- **Historical Risk Patterns**: Learning from past document analyses

### Compliance Verification

- **Regulatory Framework Mapping**: Automatic identification of applicable laws
- **Jurisdiction-Specific Analysis**: Regional legal requirement checking
- **Industry Standard Compliance**: Sector-specific regulation verification
- **Missing Clause Detection**: Identification of required but absent provisions
- **Version Control**: Tracking changes and compliance status over time

### Fairness Benchmarking

- **Market Data Integration**: Comparison against industry standards
- **Peer Analysis**: Similar contract term comparison
- **Negotiation Power Assessment**: Evaluation of term favorability
- **Alternative Clause Suggestions**: Recommendations for fairer terms
- **Market Position Scoring**: Quantitative fairness measurement

## 🔧 API Endpoints

### Document Management

- `POST /api/document/upload-and-analyze` - Upload and analyze new documents
- `POST /api/document/reanalyze` - Re-analyze existing documents with updated models
- `DELETE /api/document/delete` - Secure document deletion with Cloudinary cleanup
- `GET /api/document/signed-url` - Generate temporary access URLs
- `POST /api/document/analyze-base64` - Legacy Base64 document analysis

### Chat & AI Interaction

- `POST /api/chat/message` - Send messages to AI assistant
- `POST /api/chat/message-with-document` - Context-aware document chat
- `GET /api/chat/documents/:userId` - Retrieve user documents for chat context
- `GET /api/chat/what-if-examples` - Get scenario analysis examples

### Fairness Benchmarking

- `POST /api/benchmark/analyze-fairness` - Comprehensive fairness analysis
- `POST /api/benchmark/upload-and-analyze` - Upload with immediate benchmarking
- `GET /api/benchmark/market-data` - Access market comparison data
- `POST /api/benchmark/compare-terms` - Specific term comparison

### Authentication & User Management

- Firebase Authentication integration
- Session management and token validation
- User profile and preference management
- Access control and permission verification

## 📱 Detailed Usage Guide

### Getting Started

1. **Create Account**: Sign up with email/password or social login
2. **Choose Your Role**: Select your primary role (Tenant, Employee, Consumer, etc.)
3. **Upload First Document**: Drag and drop or browse to select a file
4. **Review Analysis**: Examine AI-generated insights and recommendations
5. **Explore Features**: Try chat, benchmarking, and dashboard features

### Document Analysis Workflow

1. **Upload Document**

   - Select file (PDF, Word, or text)
   - Choose your role in the document relationship
   - Specify jurisdiction if relevant
   - Wait for automatic processing

2. **Review Analysis Results**

   - **Risk Assessment**: Review color-coded risk levels
   - **Key Clauses**: Examine extracted important terms
   - **Compliance Check**: Verify regulatory compliance
   - **Recommendations**: Follow suggested improvements

3. **Use Advanced Features**
   - **Chat with Document**: Ask specific questions about the content
   - **Fairness Benchmark**: Compare terms against market standards
   - **What-If Analysis**: Explore hypothetical scenarios
   - **Export Results**: Download comprehensive reports

### AI Chat Assistant Usage

1. **Select Document Context**: Choose a document for context-aware chat
2. **Ask Questions**: Use natural language to inquire about specific clauses
3. **Scenario Planning**: Ask "What if..." questions for predictive analysis
4. **Get Recommendations**: Request specific advice and action items
5. **Quick Actions**: Use predefined analysis shortcuts

### Fairness Benchmarking

1. **Select Document**: Choose from uploaded documents or upload new one
2. **Configure Analysis**: Set your role and jurisdiction
3. **Run Benchmark**: Get comparative analysis against market data
4. **Review Results**:
   - Overall fairness score (0-100)
   - Market position assessment
   - Specific term comparisons
   - Negotiation opportunities
5. **Take Action**: Use insights for contract negotiations

### Dashboard Features

- **Document Library**: Centralized view of all analyzed documents
- **Activity Feed**: Recent analysis activities and updates
- **Analytics Overview**: Risk distribution and document insights
- **Team Management**: Collaborate with team members
- **Settings**: Customize preferences and notification settings

## 💡 Best Practices

### Document Preparation

- **Clear Scans**: Ensure PDFs are text-searchable, not just images
- **Complete Documents**: Upload full contracts for comprehensive analysis
- **Recent Versions**: Use the most current version of your documents
- **Multiple Formats**: Try different formats if one doesn't work optimally

### Analysis Optimization

- **Accurate Role Selection**: Choose your correct role for tailored analysis
- **Specific Jurisdictions**: Select precise location for relevant compliance checks
- **Detailed Questions**: Ask specific, focused questions in chat for better responses
- **Regular Re-analysis**: Re-analyze documents when laws or markets change

### Security Best Practices

- **Regular Password Updates**: Change passwords periodically
- **Document Cleanup**: Delete outdated or unnecessary documents
- **Access Control**: Review and manage shared document permissions
- **Privacy Settings**: Configure notification and data sharing preferences

## 🔍 Troubleshooting

### Common Issues

#### File Upload Problems

- **Error**: "File too large"
  - **Solution**: Compress file under 10MB or split into smaller sections
- **Error**: "Invalid file type"
  - **Solution**: Convert to supported format (PDF, DOCX, TXT)
- **Error**: "File appears corrupted"
  - **Solution**: Re-save document or try a different source

#### Analysis Issues

- **Poor Quality Results**:
  - Ensure document is text-searchable
  - Try uploading a cleaner version
  - Verify correct role and jurisdiction selection
- **Missing Content**:
  - Check if document contains actual text (not just images)
  - Verify all pages are included in the upload

#### Chat Problems

- **No Document Context**:
  - Select a document from the dropdown before asking questions
  - Ensure document was successfully analyzed
- **Slow Responses**:
  - Check internet connection
  - Try refreshing the page
  - Verify server status

#### Authentication Issues

- **Login Problems**:
  - Clear browser cache and cookies
  - Check email/password combination
  - Try password reset if needed
- **Session Expired**:
  - Re-login to refresh session
  - Enable "Remember Me" for longer sessions

### Getting Help

- **Documentation**: Check this README for detailed information
- **Issue Tracker**: Report bugs on GitHub Issues
- **Community**: Join discussions in GitHub Discussions
- **Support**: Contact maintainers for critical issues

## 🌟 Advanced Features

### What-If Scenario Analysis

Explore hypothetical situations and their legal implications:

- **Contract Termination Scenarios**: Understand consequences of early termination
- **Breach of Contract Analysis**: Evaluate potential breach situations
- **Amendment Impact Assessment**: See how proposed changes affect the agreement
- **Risk Mitigation Planning**: Develop strategies for identified risks

### Multi-Document Comparison

Compare multiple contracts side-by-side:

- **Term Variation Analysis**: Identify differences in similar contracts
- **Best Practice Identification**: Find optimal clauses across documents
- **Consistency Checking**: Ensure uniform terms across related agreements
- **Template Development**: Create standardized contract templates

### Team Collaboration Features

Work together on document analysis:

- **Shared Workspaces**: Collaborate with team members
- **Comment and Review**: Add notes and feedback on analyses
- **Approval Workflows**: Set up document approval processes
- **Activity Tracking**: Monitor team document activities

### Custom Analysis Models

Tailor analysis to specific needs:

- **Industry-Specific Models**: Specialized analysis for different sectors
- **Regional Legal Frameworks**: Jurisdiction-specific compliance checking
- **Custom Risk Profiles**: Personalized risk assessment criteria
- **Template Matching**: Compare against organizational standard templates

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve LexiGuard:

### Getting Started

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Clone Your Fork**: `git clone https://github.com/yourusername/LexiGuard.git`
3. **Create a Branch**: `git checkout -b feature/amazing-feature`
4. **Set Up Development Environment**: Follow the installation instructions above

### Development Guidelines

#### Code Style

- **Frontend**: Follow React best practices and ESLint configuration
- **Backend**: Use Node.js conventions and Express patterns
- **Formatting**: Use Prettier for consistent code formatting
- **Naming**: Use descriptive variable and function names

#### Commit Messages

Use conventional commit format:

```
feat: add fairness benchmarking feature
fix: resolve document upload timeout issue
docs: update API documentation
style: improve responsive design
test: add unit tests for document service
```

#### Testing

- **Frontend**: Write Jest tests for components and utilities
- **Backend**: Create integration tests for API endpoints
- **E2E**: Add Playwright tests for critical user flows
- **Coverage**: Aim for 80%+ test coverage on new features

### Types of Contributions

#### 🐛 Bug Reports

- Use the GitHub issue template
- Include steps to reproduce
- Provide browser/environment details
- Include screenshots or logs when applicable

#### ✨ Feature Requests

- Check existing issues for duplicates
- Clearly describe the proposed feature
- Explain the use case and benefits
- Consider implementation complexity

#### 📝 Documentation

- Improve code comments
- Update README sections
- Add API documentation
- Create user guides and tutorials

#### 🔧 Code Contributions

- **Frontend Improvements**: UI/UX enhancements, new components
- **Backend Features**: New API endpoints, service improvements
- **AI/ML Enhancements**: Better analysis algorithms, new models
- **Performance Optimization**: Speed improvements, caching strategies

### Pull Request Process

1. **Update Documentation**: Ensure README and code comments are current
2. **Add Tests**: Include appropriate test coverage
3. **Check Build**: Verify all tests pass and build succeeds
4. **Update Changelog**: Add entry for your changes
5. **Request Review**: Tag maintainers for code review

### Development Areas

#### High Priority

- Mobile responsiveness improvements
- Performance optimization
- Additional file format support
- Enhanced AI analysis capabilities

#### Medium Priority

- Advanced dashboard analytics
- Real-time collaboration features
- API rate limiting enhancements
- Internationalization (i18n)

#### Future Ideas

- Machine learning model improvements
- Blockchain integration for document integrity
- Advanced workflow automation
- Enterprise features and SSO

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability and warranty not provided

### Third-Party Licenses

- **Google Gemini AI**: Subject to Google's terms of service
- **Cloudinary**: Subject to Cloudinary's terms of service
- **Firebase**: Subject to Google Cloud terms of service
- **React & Dependencies**: Various open-source licenses (MIT, Apache 2.0, etc.)

## 🆘 Support & Help

### Getting Help

1. **Documentation**: Check this comprehensive README first
2. **FAQ**: Look for common questions in GitHub Discussions
3. **Community**: Join our GitHub Discussions for peer support
4. **Issues**: Report bugs using GitHub Issues with detailed information

### Issue Reporting Guidelines

When reporting issues, please include:

- **Environment**: OS, browser, Node.js version
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: Visual evidence when applicable
- **Console Logs**: Any error messages or warnings

### Feature Requests

For new feature requests:

- **Use Case**: Explain why this feature is needed
- **User Story**: Describe from a user's perspective
- **Acceptance Criteria**: Define what success looks like
- **Implementation Ideas**: Suggest technical approaches if you have them

### Commercial Support

For enterprise users requiring dedicated support:

- **Priority Support**: Faster response times
- **Custom Development**: Tailored features and integrations
- **Training & Onboarding**: Team training sessions
- **SLA Agreements**: Service level guarantees

Contact the maintainers for commercial support inquiries.

## 🙏 Acknowledgments

### Core Technologies

- **Google Gemini AI** - Powering our advanced document analysis capabilities
- **Cloudinary** - Providing secure and scalable file storage solutions
- **Firebase** - Authentication, database, and real-time features
- **React Community** - Excellent ecosystem and component libraries
- **Node.js Community** - Robust backend frameworks and tools

### Contributors

Special thanks to all contributors who have helped improve LexiGuard:

- **Soham156** - Project creator and lead developer
- **Community Contributors** - Bug reports, feature suggestions, and code contributions

### Inspiration & Research

- Legal technology innovations in document analysis
- AI/ML research in natural language processing
- Open-source projects in the legal tech space
- User feedback and real-world use cases

### Open Source Libraries

This project builds upon numerous open-source libraries and frameworks. See `package.json` files for complete dependency lists.

### Legal & Compliance Research

Thanks to legal professionals and compliance experts who provided guidance on:

- Regulatory framework requirements
- Industry best practices
- Risk assessment methodologies
- Document analysis standards

---

**Made with ❤️ by the LexiGuard Team**

_Empowering users with AI-driven legal document analysis for better decision-making and risk management._
