# LexiGaurd - AI-Powered Legal Document Analysis

LexiGaurd is a modern web application that provides AI-powered legal document analysis and risk assessment. Upload PDF, Word documents, or text files for instant analysis using advanced AI technology.

## 🚀 Features

- **Direct File Upload**: Support for PDF, Word (.doc, .docx), and text files
- **AI-Powered Analysis**: Advanced document analysis using Google Gemini AI
- **Risk Assessment**: Automatic risk level classification (Low, Medium, High)
- **Clause Extraction**: Identify key clauses and legal terms
- **Issue Detection**: Spot potential legal issues and concerns
- **Recommendations**: Get actionable recommendations for document improvement
- **Secure Storage**: Files stored securely on Cloudinary
- **User Management**: Firebase authentication and user profiles
- **Real-time Processing**: Fast document processing and analysis

## 🛠 Technology Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Firebase** for authentication and database
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **Multer** for file upload handling
- **Cloudinary** for file storage and management
- **PDF-Parse** and **Mammoth** for text extraction
- **Google Gemini AI** for document analysis
- **Firebase Admin** for user verification

## 📋 Prerequisites

Before running the application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- Cloudinary account for file storage
- Firebase project for authentication
- Google Gemini AI API key

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Soham156/LexiGaurd.git
cd LexiGaurd
```

### 2. Backend Setup

```bash
cd server
npm install

# Copy environment variables
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Copy environment variables
cp .env.example .env.local
```

Edit the `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=LexiGaurd

# Add your Firebase configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

### 4. Setup External Services

#### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your server `.env` file

#### Google Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to your server `.env` file as `GEMINI_API_KEY`

#### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Get your web app configuration
4. Add the config to your client `.env.local` file

## 🚀 Running the Application

### Start the Backend

```bash
cd server
npm start
```

The backend will run on `http://localhost:3000`

### Start the Frontend

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
LexiGaurd/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── firebase/      # Firebase configuration
│   └── public/
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── middleware/       # Express middleware
└── README.md
```

## 🔐 Security Features

- File type validation (PDF, DOC, DOCX, TXT only)
- File size limits (10MB maximum)
- User authentication via Firebase
- Secure file storage on Cloudinary
- CORS protection
- Input sanitization

## 📊 Supported File Formats

- **PDF Documents** (.pdf)
- **Microsoft Word** (.doc, .docx)
- **Text Files** (.txt)

## 🤖 AI Analysis Features

- **Document Type Detection**: Automatically identifies contract types
- **Key Clause Extraction**: Finds important legal clauses and terms
- **Risk Assessment**: Provides Low/Medium/High risk ratings
- **Legal Issue Detection**: Identifies potential legal problems
- **Actionable Recommendations**: Suggests improvements and next steps
- **Role-Based Analysis**: Tailored analysis for different user roles (Tenant, Landlord, Employee, etc.)

## 🔧 API Endpoints

### Document Routes

- `POST /api/document/upload-and-analyze` - Upload and analyze document
- `POST /api/document/reanalyze` - Re-analyze existing document
- `DELETE /api/document/delete` - Delete document and cleanup Cloudinary
- `POST /api/document/analyze-base64` - Analyze Base64 encoded document (legacy)

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Select Role**: Choose your role (Tenant, Landlord, Employee, etc.)
3. **Upload Document**: Drag and drop or select a file to upload
4. **Get Analysis**: Receive instant AI-powered analysis
5. **Review Results**: View risk assessment, key clauses, and recommendations
6. **Manage Documents**: Access your document history in the dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing [Issues](https://github.com/Soham156/LexiGaurd/issues)
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- Google Gemini AI for document analysis
- Cloudinary for secure file storage
- Firebase for authentication and database
- React and Node.js communities for excellent frameworks

---

**Made with ❤️ by the LexiGaurd Team**
