# Glodinas Flex Work - Job Platform

A comprehensive job platform connecting job seekers with employers. Built with React, Express, PostgreSQL (Neon), and deployed via GitHub + Vercel + Cloudflare.

## Features

### For Job Seekers
- ✅ User signup and authentication
- ✅ Create and manage resume/profile (CV builder style)
- ✅ Browse job listings with advanced filters
- ✅ Search jobs by title, company, or location
- ✅ Save/bookmark favorite jobs
- ✅ Apply to jobs with cover letters
- ✅ Track application status
- ✅ View saved jobs
- ✅ Send messages to employers
- ✅ View application history

### For Employers
- ✅ Company signup and authentication
- ✅ Create and manage company profile
- ✅ Post job openings
- ✅ View job postings and edit/delete them
- ✅ Browse candidate profiles
- ✅ Search candidates
- ✅ View applications for posted jobs
- ✅ Update application status
- ✅ Send messages to candidates
- ✅ Track candidate applications

### Universal Features
- ✅ Real-time messaging system between employers and candidates
- ✅ User authentication and authorization (JWT)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional UI with consistent navigation
- ✅ Role-based navigation (Public, Job Seeker, Employer)
- ✅ Footer with contact information and links

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time messaging

### Backend
- **Express.js** with TypeScript
- **Node.js 18+**
- **PostgreSQL** (Neon Serverless)
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **bcrypt** - Password hashing

### Infrastructure
- **GitHub** - Version control
- **Vercel** - Hosting & deployment
- **Neon** - Serverless PostgreSQL database
- **Cloudflare** - CDN & security

## Project Structure

```
glodinas-flex-work/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Role-specific navigation
│   │   └── Footer.tsx      # Site footer
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Homepage
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Signup with role selection
│   │   └── Jobs.tsx        # Job listings with filters
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   │   └── api.ts          # Axios instance
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── server/                  # Backend source
│   ├── controllers/        # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── jobs.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── company.controller.ts
│   │   ├── applications.controller.ts
│   │   ├── savedJobs.controller.ts
│   │   └── candidates.controller.ts
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   │   └── auth.ts         # JWT authentication
│   └── index.ts            # Server entry point
├── db/                      # Database
│   ├── schema/             # Drizzle schema
│   │   └── index.ts        # All table definitions
│   ├── migrations/         # SQL migrations
│   ├── index.ts            # Database connection
│   └── migrate.ts          # Migration runner
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── drizzle.config.ts
└── .env                     # Environment variables
```

## Database Schema

- **users** - User accounts (email, password, name, role)
- **profiles** - Job seeker profiles (bio, skills, experience, education)
- **companies** - Employer company profiles
- **jobs** - Job postings
- **applications** - Job applications
- **saved_jobs** - Saved/bookmarked jobs
- **conversations** - Message conversations
- **messages** - Chat messages

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Neon PostgreSQL account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/glodinas-flex-work.git
cd glodinas-flex-work
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_neon_postgres_connection_string

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# API URL (for frontend)
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 4. Database Setup

Generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
pnpm server
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/glodinas-flex-work.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables on Vercel:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `FRONTEND_URL` (your Vercel domain)
   - `VITE_API_URL` (your Vercel API domain)
   - `VITE_SOCKET_URL` (your Vercel API domain)

### Configure Cloudflare

1. Add your domain to Cloudflare
2. Update DNS to point to Vercel
3. Enable CDN and security features
4. Configure SSL/TLS settings

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/my-jobs` - Get employer's jobs

### Profile (Job Seekers)
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create profile
- `PUT /api/profile` - Update profile

### Company (Employers)
- `GET /api/company` - Get company profile
- `POST /api/company` - Create company
- `PUT /api/company` - Update company

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job
- `PUT /api/applications/:id/status` - Update application status

### Saved Jobs
- `POST /api/saved-jobs` - Save a job
- `DELETE /api/saved-jobs/:jobId` - Unsave a job
- `GET /api/saved-jobs` - Get user's saved jobs

### Candidates (Employers)
- `GET /api/candidates` - Browse candidates
- `GET /api/candidates/:id` - Get candidate profile

## Design System

### Colors
- **Primary Orange:** `#FF6B1A`
- **Primary Hover:** `#E55A0F`
- **Background:** `#FFFFFF`
- **Secondary Background:** `#F9FAFB`
- **Text Primary:** `#111827`
- **Text Secondary:** `#6B7280`

### Components
- Buttons: Primary, Secondary, Outline
- Forms: Input fields with validation
- Cards: Hover effects and shadows
- Navigation: Role-based menus

## Navigation Structure

### Public (Not Logged In)
- Home
- Browse Jobs
- Login
- Sign Up

### Job Seekers
- Home
- Browse Jobs
- My Applications
- Saved Jobs
- Messages
- Profile
- Logout

### Employers
- Home
- Post Job
- My Jobs
- Candidates
- Applications
- Messages
- Company Profile
- Logout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email info@glodinasflexwork.com or open an issue on GitHub.

---

**Built with ❤️ by Glodinas Flex Work Team**

