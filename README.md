# PM Internship Allocation Engine - Frontend

A modern React TypeScript frontend application for the PM Internship Allocation Engine, featuring AI-powered job recommendations, resume upload, and comprehensive dashboard interfaces.

## 🚀 Features

- **Authentication System**: Login/Register with role-based access
- **Dashboard Layouts**: Separate interfaces for Students, Recruiters, and Admins
- **Resume Upload**: Drag-and-drop file upload with progress tracking
- **AI Job Recommendations**: Personalized job matching with scoring
- **Profile Management**: Comprehensive user profile editing
- **Admin Panel**: AI allocation control and monitoring
- **Responsive Design**: Mobile-first approach with Material-UI
- **Real-time Notifications**: Toast notifications for user feedback
- **Modern Animations**: Smooth transitions with Framer Motion

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Framer Motion** for animations
- **React Dropzone** for file uploads
- **Context API** for state management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingSpinner, ProtectedRoute, etc.)
│   └── ...
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages for different roles
│   ├── resume/        # Resume upload functionality
│   ├── jobs/          # Job-related pages
│   ├── profile/       # Profile management
│   └── admin/         # Admin-specific pages
├── layouts/            # Layout components
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── utils/              # Utility functions and constants
├── assets/             # Static assets
├── routes/             # Route configuration
└── App.tsx            # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pm-internship-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 📱 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎯 Key Features

### Authentication System
- Role-based login (Student, Recruiter, Admin)
- Protected routes with role validation
- Persistent authentication state
- Password visibility toggle

### Student Dashboard
- Profile completion tracking
- Quick action buttons
- Application status overview
- Statistics cards with animations

### Resume Upload
- Drag-and-drop interface
- Multiple file format support (PDF, DOC, DOCX)
- Upload progress tracking
- File validation and error handling
- Preview and delete functionality

### Job Recommendations
- AI-powered job matching
- Match score visualization
- Detailed job information
- Application submission
- Favorite jobs functionality

### Admin Panel
- AI allocation control
- Real-time progress monitoring
- Configurable allocation settings
- Results export functionality
- Comprehensive analytics

### Profile Management
- Comprehensive profile editing
- Skills and interests management
- Profile completion tracking
- Avatar display

## 🎨 UI/UX Features

- **Material Design**: Consistent design language
- **Responsive Layout**: Mobile-first approach
- **Dark/Light Theme**: Automatic theme switching
- **Smooth Animations**: Framer Motion integration
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Configuration

### Theme Customization
The Material-UI theme can be customized in `src/utils/theme.ts`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // ... other theme options
});
```

### API Configuration
API endpoints are configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Frontend sends request to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token included in subsequent API requests
6. Protected routes check authentication status

## 📊 State Management

The application uses React Context API for state management:

- **AuthContext**: User authentication state
- **NotificationContext**: Toast notifications
- **Custom Hooks**: API calls and local storage

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🧪 Testing

The project includes basic testing setup with React Testing Library:

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- Framer Motion for smooth animations
- React community for the amazing ecosystem
- Government of India PM Internship Scheme initiative