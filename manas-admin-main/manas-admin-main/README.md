# Manas Admin Dashboard

A modern admin dashboard built with Next.js, TypeScript, and Tailwind CSS for managing the Manas Foundation application.

## Features

- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Admin Authentication**: Secure OTP-based admin login
- **User Management**: View, edit, and manage user profiles
- **Content Management**: 
  - Impact Cards
  - Achievement Cards
  - Success Stories
  - Media Cards
  - Events
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live data synchronization with backend
- **Role-based Access**: Admin-only functionality

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Backend API running (see manas-backend-new README)
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### Environment Variable Details

#### API Configuration
- **NEXT_PUBLIC_API_URL**: URL of your backend API
  - Development: `http://localhost:5000`
  - Production: `https://your-api-domain.com`

#### Admin Configuration
- **NEXT_PUBLIC_ADMIN_EMAIL**: Primary admin email address
  - Used for admin authentication
  - Must match the ADMIN_EMAIL in your backend

## Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd manas-admin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Start development server:**
```bash
npm run dev
```

The admin dashboard will start on `http://localhost:3001`

## Project Structure

```
manas-admin/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── users/         # User management
│   │   ├── impact-cards/  # Impact cards management
│   │   ├── achievement-cards/ # Achievement cards management
│   │   ├── success-stories/   # Success stories management
│   │   ├── media-cards/   # Media cards management
│   │   ├── events/        # Events management
│   │   └── volunteers/    # Volunteer management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── admin-sidebar.tsx # Admin sidebar component
├── lib/                  # Utility libraries
│   └── api.ts           # API client functions
├── hooks/               # Custom React hooks
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Admin Authentication

The admin dashboard uses a secure OTP-based authentication system:

1. **Login Process**:
   - Enter admin email address
   - Receive OTP via email
   - Enter OTP to authenticate
   - JWT token is stored for session management

2. **Security Features**:
   - OTP expires after 10 minutes
   - JWT tokens expire after 5 hours
   - Admin-only routes protection
   - Secure token storage

## Content Management

### User Management
- View all registered users
- Edit user profiles
- Verify/unverify users
- Delete users

### Impact Cards
- Create, edit, and delete impact cards
- Upload images
- Manage card content and links

### Achievement Cards
- Manage achievement statistics
- Update numbers and descriptions
- Customize icons

### Success Stories
- Add testimonials and quotes
- Manage author information
- Organize by location

### Media Cards
- Manage media coverage
- Update news articles and press releases
- Link to external sources

### Events
- Create and manage events
- Set dates, times, and locations
- Add registration links

## API Integration

The admin dashboard communicates with the backend API through the `lib/api.ts` file. All API calls include:

- Authentication headers
- Error handling
- TypeScript types
- Response validation

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **Custom CSS** for specific styling needs

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel:**
```bash
npm i -g vercel
vercel login
vercel
```

2. **Set environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_ADMIN_EMAIL`

3. **Deploy:**
```bash
vercel --prod
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Configure proper CORS on backend
- [ ] Use strong admin email
- [ ] Regularly update dependencies

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Ensure backend is running
   - Verify CORS configuration

2. **Admin Login Issues**:
   - Verify admin email is correct
   - Check SMTP configuration on backend
   - Ensure OTP is received within 10 minutes

3. **Build Errors**:
   - Run `npm run type-check` to check TypeScript errors
   - Ensure all environment variables are set
   - Check for missing dependencies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email fazalhayatkhan001@gmail.com or create an issue in the repository. 
