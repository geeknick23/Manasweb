# MANAS Foundation Website

A modern Next.js application for the MANAS Foundation, built with TypeScript and Tailwind CSS. This website serves as a platform for empowering widows and divorced women through meaningful connections and community support.

## Features

- **Modern Design**: Responsive design using Tailwind CSS
- **User Authentication**: Secure login and registration system
- **Profile Management**: User profiles with verification system
- **Content Display**: Dynamic content from backend API
- **Search & Filter**: Advanced search functionality
- **Mobile Responsive**: Optimized for all devices
- **TypeScript**: Full type safety throughout the application
- **Image Optimization**: Next.js Image component for performance

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

# Application Configuration
NEXT_PUBLIC_APP_NAME=MANAS Foundation
NEXT_PUBLIC_APP_DESCRIPTION=Empowering widows and divorced women
```

### Environment Variable Details

#### API Configuration
- **NEXT_PUBLIC_API_URL**: URL of your backend API
  - Development: `http://localhost:5000`
  - Production: `https://your-api-domain.com`

#### Application Configuration
- **NEXT_PUBLIC_APP_NAME**: Name of your application
- **NEXT_PUBLIC_APP_DESCRIPTION**: Brief description for SEO

## Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd manas-next
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

The website will start on `http://localhost:3000`

## Project Structure

```
manas-next/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── get-involved/      # Get involved pages
│   │   ├── impact/            # Impact pages
│   │   ├── login/             # Login page
│   │   ├── media/             # Media pages
│   │   ├── profile/           # Profile pages
│   │   ├── register/          # Registration page
│   │   ├── verify-otp/        # OTP verification
│   │   ├── view-profile/      # Public profile views
│   │   ├── view-profiles/     # Profile listing
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── Footer.tsx        # Footer component
│   │   ├── Navbar.tsx        # Navigation component
│   │   └── ...               # Other components
│   ├── context/              # React context
│   │   └── AuthContext.tsx   # Authentication context
│   ├── services/             # API services
│   │   └── api.ts           # API client functions
│   ├── types/               # TypeScript types
│   │   ├── cards.ts         # Card-related types
│   │   └── impact.ts        # Impact-related types
│   └── utils/               # Utility functions
│       └── fuzzySearch.ts   # Search functionality
├── public/                  # Static assets
│   └── images/             # Image assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## User Authentication

The website includes a complete authentication system:

### Registration Process
1. User fills registration form
2. Email verification OTP sent
3. User verifies email with OTP
4. Account activated and user can login

### Login Process
1. User enters email and password
2. JWT token issued upon successful login
3. Token stored for session management
4. Protected routes accessible

### Security Features
- Email verification required
- Password hashing on backend
- JWT token authentication
- Protected routes
- Session management

## Content Management

### Dynamic Content
- Impact cards from backend API
- Achievement statistics
- Success stories
- Media coverage
- Events calendar

### User Profiles
- Public profile pages
- Profile search and filtering
- Location-based search
- Profile verification system

## API Integration

The frontend communicates with the backend API through the `services/api.ts` file. Features include:

- Authentication handling
- Error management
- TypeScript types
- Response validation
- Loading states

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Custom components** for specific UI needs
- **Responsive design** for all screen sizes
- **Dark mode support** (if configured)

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
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_DESCRIPTION`

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

## Performance Optimization

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-rendered pages where possible
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Optimized caching strategies

## SEO Features

- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling configuration

## Security Considerations

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Configure proper CORS on backend
- [ ] Validate all user inputs
- [ ] Regularly update dependencies
- [ ] Implement rate limiting

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Ensure backend is running
   - Verify CORS configuration

2. **Authentication Issues**:
   - Check email verification status
   - Verify JWT token is valid
   - Clear browser storage if needed

3. **Build Errors**:
   - Run `npm run type-check` to check TypeScript errors
   - Ensure all environment variables are set
   - Check for missing dependencies

4. **Image Loading Issues**:
   - Verify image paths in public directory
   - Check Next.js Image component configuration
   - Ensure proper image formats

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

MANAS Foundation - manasfoundation2025@gmail.com

For technical support, create an issue in the repository.
