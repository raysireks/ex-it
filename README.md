# Ex→It

**Break Free, Move Forward**

A supportive web application to help people maintain no-contact with their ex-partners and focus on healing and personal growth.

## Features

- **2-Second Splash Screen**: Welcome users with the branding and tagline
- **Days of No Contact Counter**: Track your progress with a prominent, centered counter
- **Community Wisdom**: View and vote on the top 10 community-submitted blurbs of encouragement
- **Submit Your Own Blurbs**: Share your wisdom with the community (requires login)
- **Warning System**: Thoughtful intervention when users feel the urge to message their ex
- **Support Resources**: 6 categories of support including Community, Professional Help, Stalling Methods, AI Chat, Reasons for Leaving, and Looking Forward
- **Recovery Resources**: Educational modules to guide the healing journey
- **Authentication**: Simple login system with localStorage persistence

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for fast builds and development
- **CSS3** with modern animations and gradients
- All backend services are stubbed for demonstration

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

### Development

The application will be available at `http://localhost:5173/` when running the dev server.

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── services/        # Stub service implementations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
├── App.css          # Global styles
└── main.tsx         # Application entry point
```

## Services (Stubbed)

All services are currently stubbed with in-memory implementations:

- **authService**: Handles login/logout with localStorage persistence
- **blurbService**: Manages community wisdom posts and voting
- **resourceService**: Provides recovery resource modules

## Future Enhancements

- Real backend API integration
- User registration and profile management
- AI chat companion
- Mobile app versions
- Community forums
- Professional help directory
- Progress tracking and analytics

## License

See [LICENSE](LICENSE) file for details.
