# Signalist 📈

A modern stock market application built with Next.js that provides real-time stock data, personalized watchlists, price alerts, and comprehensive market analysis.

## 🚀 Features

### 📊 Core Functionality
- **Real-time Stock Data**: Live stock prices, quotes, and market data from Finnhub API
- **Advanced Search**: Intelligent stock search with autocomplete and filtering
- **Stock Details**: Comprehensive stock information including financials, profile, and technical analysis
- **Interactive Charts**: TradingView widgets for advanced charting and technical analysis
- **Market News**: Aggregated financial news from multiple sources

### 👤 User Management
- **Secure Authentication**: User registration, login, and session management with Better Auth
- **Personalized Profiles**: Customizable user preferences and settings
- **Country Selection**: Support for international users with country-specific features
- **Investment Preferences**: Track user goals, risk tolerance, and preferred industries

### ⭐ Watchlist Management
- **Dynamic Watchlist**: Add/remove stocks from personal watchlists
- **Real-time Updates**: Live price tracking and performance monitoring
- **Smart Organization**: Automatic sorting and categorization of watchlist items
- **Quick Actions**: One-click add/remove functionality with optimistic UI updates
- **Performance Metrics**: Track portfolio value, gainers/losers, and overall performance
- **Responsive Tables**: Mobile-friendly watchlist display with sorting and filtering
### 🚨 Price Alerts System
- **Custom Alerts**: Set price thresholds for any stock in your watchlist
- **Alert Types**: Upper/lower price triggers with customizable thresholds
- **Frequency Controls**: Once, daily, or weekly alert options
- **Email Notifications**: Professional email alerts with detailed information
- **Alert Management**: View, edit, and delete existing alerts
- **Smart Monitoring**: Automated price checking every 5 minutes
- **Performance Tracking**: Historical alert performance and trigger analytics
### 📧 Email Notifications
- **Daily Watchlist Updates**: Automated daily portfolio summaries with performance metrics
- **Weekly Reports**: Comprehensive weekly analysis and performance reviews
- **Alert Notifications**: Real-time price alert emails with detailed information
- **Professional Templates**: Dark-themed emails with yellow accents matching brand identity
- **Mobile Optimized**: Responsive email design for all devices
- **Personalized Content**: User-specific data and recommendations
### 🔍 Search & Discovery
- **Advanced Search**: Intelligent stock search with real-time suggestions
- **Popular Stocks**: Curated list of popular and trending stocks
- **Filter Options**: Search by symbol, company name, exchange, or type
- **Quick Actions**: Add stocks to watchlist directly from search results
- **Search History**: Recent searches and saved preferences
### 📈 Market Data & Analysis
- **Real-time Quotes**: Live stock prices and percentage changes
- **Financial Metrics**: P/E ratios, market capitalization, and key financial indicators
- **Company Profiles**: Detailed company information and business metrics
- **Technical Analysis**: TradingView integration for advanced charting
- **Market News**: Curated financial news and market updates
- **Sector Performance**: Industry and sector-based analysis

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Radix UI with Shadcn/ui components
- **State Management**: React hooks and server actions
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications
- **Charts**: TradingView widgets for financial data visualization

### Backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Better Auth for secure user management
- **API**: Next.js API routes for server-side functionality
- **Email**: Nodemailer with Gmail integration
- **Background Jobs**: Inngest for scheduled tasks and workflows
- **Data Provider**: Finnhub API for real-time stock data
- **File Upload**: Support for various file types and media

### Infrastructure
- **Deployment**: Optimized for Vercel deployment
- **Environment**: Environment variable management
- **Middleware**: Custom middleware for authentication and routing
- **Caching**: Optimized caching strategies for performance
- **Type Safety**: Full TypeScript coverage

## 📁 Project Structure

```
stockzmaniac/
├── app/                    # Next.js app directory
│   ├── (auth)/             # Authentication routes
│   │   ├── sign-in/         # User login page
│   │   └── sign-up/         # User registration page
│   ├── (root)/             # Main application routes
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx        # Root layout
│   │   ├── stocks/          # Stock-related pages
│   │   │   └── [symbol]/     # Dynamic stock detail pages
│   │   └── watchlist/      # Watchlist management
│   ├── api/                # API routes
│   │   ├── inngest/        # Inngest webhook endpoint
│   │   └── test_db/       # Database testing
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout component
├── components/            # Reusable React components
│   ├── ui/                 # Shadcn/ui components
│   ├── forms/              # Form components
│   ├── AlertModal.tsx      # Alert creation modal
│   ├── Header.tsx          # Application header
│   ├── NavItems.tsx        # Navigation items
│   ├── SearchCommand.tsx   # Stock search component
│   ├── TradingViewWidget.tsx # TradingView integration
│   ├── UserDropdown.tsx    # User menu component
│   ├── WatchlistButton.tsx  # Watchlist toggle button
│   ├── WatchlistPage.tsx    # Watchlist page component
│   └── WatchlistTable.tsx   # Watchlist table component
├── lib/                   # Library and utilities
│   ├── actions/            # Server actions
│   │   ├── auth.actions.ts   # Authentication actions
│   │   ├── alert.actions.ts  # Alert management actions
│   │   ├── finnhub.actions.ts # Finnhub API actions
│   │   ├── user.actions.ts   # User management actions
│   │   └── watchlist.actions.ts # Watchlist actions
│   ├── database/           # Database configuration
│   │   ├── mongoose.ts       # MongoDB connection
│   │   └── models/          # Mongoose models
│   ├── inngest/            # Inngest configuration
│   │   ├── client.ts         # Inngest client
│   │   ├── functions.ts      # Background job functions
│   │   └── prompts.ts        # AI prompts
│   ├── nodemailer/         # Email configuration
│   │   ├── index.ts          # Email transporter
│   │   ├── templates.ts      # Email templates
│   │   └── watchlist-alert-templates.ts # Watchlist email templates
│   ├── constants.ts        # Application constants
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
    └── useDebounce.ts      # Debounce hook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or later
- MongoDB database
- Gmail account (for email functionality)
- Finnhub API key
- Inngest account (for background jobs)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stockzmaniac
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/stockzmaniac

# Authentication
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000/api/auth

# Finnhub API
NEXT_PUBLIC_FINNHUB_API_KEY=your-finnhub-api-key
FINNHUB_API_KEY=your-finnhub-api-key

# Email Configuration
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-password

# Inngest
INNGEST_EVENT_KEY=your-inngest-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout

### Stock Data
- `GET /api/stocks/search?q=query` - Search stocks
- `GET /api/stocks/[symbol]` - Get stock details
- `GET /api/stocks/[symbol]/quote` - Get stock quote
- `GET /api/stocks/[symbol]/profile` - Get company profile
- `GET /api/stocks/[symbol]/financials` - Get financial data

### Watchlist
- `POST /api/watchlist/add` - Add stock to watchlist
- `POST /api/watchlist/remove` - Remove stock from watchlist
- `GET /api/watchlist` - Get user watchlist
- `GET /api/watchlist/data` - Get watchlist with detailed data

### Alerts
- `POST /api/alerts/create` - Create price alert
- `DELETE /api/alerts/[id]` - Delete alert
- `GET /api/alerts` - Get user alerts

### Background Jobs
- `POST /api/inngest` - Inngest webhook endpoint

## 🔄 Background Jobs

### Scheduled Functions
- **Daily Watchlist Updates**: Sends daily portfolio summaries at 9 AM
- **Weekly Summary Reports**: Sends comprehensive weekly analysis on Mondays at 9 AM
- **Price Alert Monitoring**: Checks stock prices every 5 minutes for alert triggers
- **Market News Digest**: Daily market news summaries

### Event-Driven Functions
- **User Registration**: Welcome emails and onboarding
- **Alert Creation**: Confirmation emails for new alerts
- **Alert Triggered**: Real-time notifications when price conditions are met

## 🎨 UI Components

### Core Components
- **Header**: Navigation bar with user menu and search
- **SearchCommand**: Advanced stock search with autocomplete
- **WatchlistButton**: Toggle button for watchlist management
- **WatchlistTable**: Interactive table with watchlist data
- **AlertModal**: Modal for creating price alerts
- **TradingViewWidget**: Financial charting integration

### UI Features
- **Dark Theme**: Consistent dark mode throughout the application
- **Responsive Design**: Mobile-first design approach
- **Interactive Tables**: Sortable, filterable data tables
- **Toast Notifications**: User feedback and system messages
- **Loading States**: Optimistic UI updates with loading indicators
- **Error Handling**: Graceful error states and user feedback

## 📊 Data Sources

### Primary API
- **Finnhub API**: Real-time stock market data
  - Stock quotes and prices
  - Company profiles and financials
  - Market news and analysis
  - Technical indicators

### Data Types
- **Stock Information**: Symbol, company name, exchange, type
- **Financial Data**: P/E ratios, market cap, revenue
- **Market News**: Headlines, summaries, sources
- **Technical Analysis**: Chart data and indicators

## 🔐 Security Features

### Authentication
- **Secure Sessions**: Better Auth with session management
- **Password Hashing**: Secure password storage
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API rate limiting for abuse prevention

### Data Protection
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output sanitization
- **Secure Headers**: Proper security headers configuration

## 📧 Email System

### Email Types
- **Welcome Emails**: User onboarding and introduction
- **Daily Updates**: Portfolio summaries and market updates
- **Weekly Reports**: Comprehensive weekly analysis
- **Alert Notifications**: Real-time price alert emails
- **News Digests**: Market news summaries

### Email Features
- **Professional Templates**: Dark-themed with yellow accents
- **Mobile Responsive**: Optimized for all devices
- **Personalization**: User-specific content and recommendations
- **Unsubscribe Options**: User preference management

## 🚀 Deployment

### Vercel Deployment
1. Push to GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy automatically

### Environment Setup
- **Production Database**: MongoDB Atlas or self-hosted MongoDB
- **Email Service**: Gmail or SMTP server
- **API Keys**: Finnhub and Inngest API keys
- **Domain**: Custom domain configuration

## 🧪 Development

### Code Style
- **TypeScript**: Full TypeScript coverage
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

### Architecture
- **Server Components**: Next.js App Router with server actions
- **Client Components**: React with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **API Routes**: RESTful API design
- **Background Jobs**: Inngest for scheduled tasks

### Testing
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: End-to-end testing
- **Database Tests**: Database connection and operations

## 📈 Performance

### Optimization
- **Code Splitting**: Automatic code splitting
- **Image Optimization**: Next.js Image optimization
- **Bundle Analysis**: Bundle size optimization
- **Caching**: Strategic caching for performance
- **Lazy Loading**: Component and data lazy loading

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Application performance monitoring
- **User Analytics**: User behavior analysis
- **Database Monitoring**: Database performance tracking

## 🤝 Contributing

### Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
6. Follow code style guidelines

### Development Workflow
- **Feature Branches**: Separate branches for new features
- **Code Reviews**: Peer review process
- **Testing**: Comprehensive testing requirements
- **Documentation**: Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions
- Contact the development team

## 🚀 Roadmap

### Upcoming Features
- **Advanced Analytics**: Enhanced portfolio analytics
- **Social Features**: Social sharing and community features
- **Mobile App**: Native mobile application
- **API Extensions**: Third-party integrations
- **Advanced Alerts**: More sophisticated alert types
- **Portfolio Analytics**: Deep portfolio analysis tools

---

## 📊 Current Status

✅ Core Features Complete
✅ Authentication System
✅ Watchlist Management
✅ Price Alerts
✅ Email Notifications
✅ Real-time Data
✅ Responsive Design
✅ Dark Theme
✅ Background Jobs
✅ Professional Templates

🔄 In Development
- Advanced Analytics
- Social Features
- Mobile Application
- API Extensions
- Enhanced Reporting
