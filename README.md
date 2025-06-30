# FreelanceOS 🚀

**The comprehensive freelancer operating system** - organize projects, manage billing, and streamline communication in one powerful platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/freelanceos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

## 🌟 Live Demo

Experience FreelanceOS in action: **[https://freelanceos-demo.vercel.app](https://freelanceos-demo.vercel.app)**

**Demo Credentials:**
- Email: `user@demo.com`
- Password: `Demo@123`

> 💡 The demo environment automatically resets daily to maintain a clean state for all users.

## ⚡ Quick Start

Get FreelanceOS running locally in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/freelanceos.git
cd freelanceos

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Gemini API credentials

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start managing your freelance business! 🎉

## 🚀 Features

### 📁 **Project Management**
- Create and organize projects with detailed descriptions
- Track project status (Active, Completed, On Hold)
- Add notes and updates to projects
- Project-specific billing integration

### 💰 **Billing & Invoicing**
- Generate professional invoices
- Track payment status (Paid/Pending)
- Project-specific bill management
- Comprehensive billing dashboard

### ✉️ **AI Email Assistant**
- AI-powered email generation using Google Gemini
- Multiple tone options (Professional, Friendly, Formal)
- Context-aware email composition
- Perfect for client communication

### 📊 **Dashboard & Analytics**
- Real-time project and billing statistics
- Recent activity tracking
- Quick action shortcuts
- Comprehensive overview of your freelance business

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI Components
- **Backend**: Supabase (Auth, Database, Real-time)
- **AI Integration**: Google Gemini API
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 📋 Prerequisites

Before setting up FreelanceOS, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Supabase** account ([sign up here](https://supabase.com))
- **Google AI Studio** account for Gemini API ([get API key](https://makersuite.google.com/app/apikey))

## 🛠️ Detailed Setup

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
VITE_APP_NAME=FreelanceOS
VITE_APP_VERSION=1.0.0
```

### 2. Supabase Setup

1. **Create a new Supabase project**
2. **Run the database schema**:
   ```sql
   -- Copy and paste the contents of database/schema.sql
   -- in your Supabase SQL editor
   ```
3. **Set up Row Level Security (RLS)**:
   ```sql
   -- Copy and paste the contents of database/policies.sql
   ```
4. **Add demo data** (optional):
   ```sql
   -- Copy and paste the contents of database/demo-data.sql
   ```

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### 4. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Test database reset functionality
npm run test:cron:dry
```

## 🏗️ Architecture

FreelanceOS follows a modular, component-first architecture designed for scalability and maintainability:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── layout/         # Layout components
│   ├── auth/           # Authentication components
│   └── billing/        # Billing-specific components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── services/           # API and database services
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelanceos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_APP_NAME=FreelanceOS
   VITE_APP_VERSION=1.0.0
   ```

4. **Database Setup**
   - Run the SQL scripts in `/database/` on your Supabase instance
   - Set up Row Level Security (RLS) policies

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### One-Click Deploy

Deploy FreelanceOS instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/freelanceos)

### Manual Deployment

#### Vercel (Recommended)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

#### Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

For detailed production deployment instructions, see [PRODUCTION_DEPLOYMENT.md](docs/PRODUCTION_DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ | - |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | - |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | ✅ | - |
| `VITE_APP_NAME` | Application name | ✅ | FreelanceOS |
| `VITE_APP_VERSION` | Application version | ✅ | 1.0.0 |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | ❌ | false |
| `VITE_ENABLE_DEMO_MODE` | Enable demo mode features | ❌ | false |

### Feature Flags

FreelanceOS supports feature flags for different environments:

```env
# Demo Environment
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=false

# Production Environment
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_ANALYTICS=true
```

## 📚 Documentation

- **[Production Deployment Guide](docs/PRODUCTION_DEPLOYMENT.md)** - Complete guide for deploying to production
- **[Database Schema](database/schema.sql)** - Database structure and relationships
- **[API Documentation](docs/API.md)** - Backend API endpoints and usage
- **[Component Library](docs/COMPONENTS.md)** - UI component documentation



## 🐛 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### Database Connection Issues

1. Verify Supabase URL and keys in `.env`
2. Check if RLS policies are properly configured
3. Ensure database schema is up to date

#### Authentication Problems

1. Check Supabase Auth settings
2. Verify redirect URLs are configured
3. Test with demo credentials: `user@demo.com` / `Demo@123`

#### Performance Issues

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for memory leaks
npm run dev
# Open Chrome DevTools > Performance tab
```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/freelanceos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/freelanceos/discussions)
- **Email**: support@freelanceos.com

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork and clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env`
4. **Start development**: `npm run dev`

### Contribution Guidelines

1. **Code Style**: Follow existing patterns and use TypeScript
2. **Testing**: Add tests for new features
3. **Documentation**: Update docs for any changes
4. **Commits**: Use conventional commit messages

### Pull Request Process

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes with proper tests
3. Update documentation if needed
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with a clear description

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint


```

## 🌟 Roadmap

### Version 1.1 (Coming Soon)
- [ ] Time tracking integration
- [ ] Client portal access
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)

### Version 1.2 (Future)
- [ ] Team collaboration features
- [ ] Advanced project templates
- [ ] Integration with accounting software
- [ ] Multi-currency support

## 📊 Performance

FreelanceOS is optimized for performance:

- **Bundle Size**: < 500KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 95+ across all metrics

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Protection**: HTTPS encryption in transit
- **Privacy**: No personal data stored without consent

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com)** - Backend infrastructure and authentication
- **[Google Gemini](https://ai.google.dev)** - AI-powered email assistance
- **[ShadCN UI](https://ui.shadcn.com)** - Beautiful and accessible UI components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev)** - Beautiful open-source icons
- **[Vercel](https://vercel.com)** - Deployment and hosting platform
- **[React](https://reactjs.org)** - Frontend framework
- **[TypeScript](https://www.typescriptlang.org)** - Type safety and developer experience

## 📞 Support

Need help with FreelanceOS?

- **Documentation**: Check our comprehensive docs
- **Community**: Join our [Discord community](https://discord.gg/freelanceos)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/freelanceos/issues)
- **Email**: Contact us at support@freelanceos.com

---

<div align="center">

**FreelanceOS** - Empowering freelancers with the tools they need to succeed. 🚀

Made with ❤️ by the FreelanceOS team

[Website](https://freelanceos.com) • [Demo](https://freelanceos-demo.vercel.app) • [Documentation](docs/) • [Community](https://discord.gg/freelanceos)

</div>
