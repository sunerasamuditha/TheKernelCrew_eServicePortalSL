# e-Passport Sri Lanka - Digital Services Portal

A modern, AI-powered e-passport application portal for Sri Lanka, built with React frontend, Node.js backend, PostgreSQL database, and Redis caching.

## 🚀 Features

### AI-Powered Components
- **AI SmartScan**: OCR technology to extract NIC information automatically
- **AI PhotoGuard**: ICAO compliance checking for passport photos
- **Multilingual AI Chatbot**: Support in English, Sinhala, and Tamil

### Core Functionality
- **User Registration & Authentication**: Secure login system
- **Application Management**: Step-by-step passport application process
- **Document Upload**: Drag-and-drop file uploads with validation
- **Payment Processing**: Multiple payment methods (cards, banking, mobile)
- **Appointment Booking**: Real-time slot availability and booking
- **Status Tracking**: Live application progress tracking
- **Queue Management**: Real-time queue position updates

### User Experience
- **Responsive Design**: Mobile-first, works on all devices
- **Multi-language Support**: English, Sinhala, Tamil
- **Dark/Light Mode**: Adaptive UI themes
- **Progressive Web App**: App-like experience
- **Offline Capability**: Basic functionality without internet

## 🏗️ Architecture

```
├── frontend/           # React + Vite frontend
├── backend/           # Node.js + Express API
├── db/               # PostgreSQL database
├── docker-compose.yml # Container orchestration
└── .env.example      # Environment configuration
```

### Technology Stack

**Frontend:**
- React 18 with Hooks
- Vite for build tooling
- CSS3 with CSS Variables
- Context API for state management
- Camera API for photo capture

**Backend:**
- Node.js + Express.js
- PostgreSQL for main database
- Redis for caching and sessions
- JWT for authentication
- Multer for file uploads

**Infrastructure:**
- Docker & Docker Compose
- Nginx for reverse proxy
- Environment-based configuration

## 🚦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TheKernelCrew_eServicePortalSL
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Local Development

**Frontend Development:**
```bash
cd frontend
npm install
npm run dev
```

**Backend Development:**
```bash
cd backend
npm install
npm run dev
```

## 📱 Application Flow

1. **Registration/Login**: User creates account or logs in
2. **AI SmartScan**: User scans NIC for auto-data extraction
3. **AI PhotoGuard**: User takes/uploads photo for compliance check
4. **Document Upload**: User uploads required documents
5. **Payment & Booking**: User pays fees and books appointment
6. **Status Tracking**: User tracks application progress
7. **Collection**: User collects passport from office

## 🔧 Configuration

### Environment Variables

```env
# Database
POSTGRES_USER=epassport_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=epassport_sl

# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Redis
REDIS_URL=redis://localhost:6379
```

### Docker Services

- **Frontend**: React app served by Nginx on port 3000
- **Backend**: Node.js API on port 5000
- **Database**: PostgreSQL on port 5432
- **Redis**: Cache and session store on port 6379

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API endpoint protection
- **Input Validation**: All inputs sanitized
- **File Upload Security**: Type and size restrictions
- **CORS Protection**: Cross-origin request management
- **Helmet.js**: Security headers
- **Environment Isolation**: Sensitive data in env vars

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application

### Documents
- `GET /api/documents/:applicationId` - Get documents
- `POST /api/documents/:applicationId/upload` - Upload document
- `DELETE /api/documents/:documentId` - Delete document

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/history/:userId` - Payment history

### Appointments
- `GET /api/appointments/available/:office/:date` - Check availability
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Reschedule appointment

### Support
- `GET /api/support/search` - Search knowledge base
- `POST /api/support/chat` - Chat with AI assistant
- `POST /api/support/ticket` - Create support ticket

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Deployment

1. **Set up production environment**
   ```bash
   cp .env.example .env.production
   # Configure production values
   ```

2. **Build and deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Considerations

- Use strong passwords and secrets
- Enable SSL/TLS certificates
- Configure proper firewall rules
- Set up database backups
- Monitor application logs
- Set up error tracking

## 📈 Monitoring & Logging

- Application logs via Docker logs
- Database performance monitoring
- API response time tracking
- Error tracking and alerting
- User analytics and usage metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**TheKernelCrew**
- Full-stack development
- UI/UX design
- DevOps and deployment

## 📞 Support

For technical support:
- Create an issue in the repository
- Contact the development team
- Use the in-app AI assistant

---

**Note**: This is a prototype implementation for demonstration purposes. For production use, ensure proper security auditing, compliance checks, and government approval processes.
