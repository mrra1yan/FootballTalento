# FootballTalento ⚽

A modern football talent discovery and ranking platform built with Next.js, TypeScript, and Tailwind CSS. This platform enables scouts, clubs, and football enthusiasts to discover and rank talented players.

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **HTTP Client:** Axios
- **UI Notifications:** React Hot Toast
- **Authentication:** Custom JWT-based auth

## 📁 Project Structure

```
footballtalento/
├── app/                          # Next.js App Router directory
│   ├── auth/                     # Authentication pages
│   │   ├── forgot-password/      # Password recovery page
│   │   ├── login/                # User login page
│   │   ├── register/             # User registration page
│   │   └── reset-password/       # Password reset page
│   │
│   ├── components/               # React components
│   │   ├── home/                 # Homepage components
│   │   │   ├── featured-players/ # Featured players section
│   │   │   │   ├── FeaturedPlayersSection.tsx
│   │   │   │   ├── PlayerCard.tsx
│   │   │   │   └── PlayerScoreRing.tsx
│   │   │   ├── rankings-preview/ # Rankings preview section
│   │   │   │   ├── ClubsRankings.tsx
│   │   │   │   ├── PlayersRankings.tsx
│   │   │   │   └── RankingsPreview.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── SafetyTrust.tsx
│   │   │   ├── StoriesHighlightsSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── TrustedClubs.tsx
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Footer.tsx        # Global footer
│   │   │   └── Header.tsx        # Global header/navigation
│   │   │
│   │   └── providers/            # Context providers
│   │       └── AuthProvider.tsx  # Authentication provider
│   │
│   ├── dashboard/                # Dashboard pages
│   │   └── page.tsx              # Main dashboard
│   │
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
│
├── lib/                          # Utility libraries
│   ├── api/                      # API integration
│   │   └── auth.ts               # Authentication API calls
│   └── data/                     # Static data
│       └── countries.ts          # Countries data
│
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   │   ├── clubs-images/         # Club logos
│   │   │   ├── FC Barcelona.png
│   │   │   ├── FC Bayern Munich.svg
│   │   │   └── Real Madrid CF.jpg
│   │   ├── players-images/       # Player photos
│   │   │   ├── Antonio Rüdiger.jpg
│   │   │   ├── Bukayo Saka.webp
│   │   │   ├── Florian Wirtz.webp
│   │   │   ├── Gavi.jpg
│   │   │   ├── Ilkay Gündogan.jpg
│   │   │   ├── Jamal Musiala.jpg
│   │   │   ├── Joshua Kimmich.jpg
│   │   │   ├── Jude Bellingham.webp
│   │   │   ├── Kai Havertz.webp
│   │   │   ├── Manuel Neuer.jpg
│   │   │   ├── Pedri.webp
│   │   │   ├── Thomas Müller.jpg
│   │   │   └── Toni Kroos.webp
│   │   ├── Hero Image 1.png
│   │   ├── Hero Image 2.jpg
│   │   └── Hero Image 3.webp
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── store/                        # Zustand state management
│   └── authStore.ts              # Authentication state
│
├── types/                        # TypeScript type definitions
│   └── auth.ts                   # Authentication types
│
├── proxy.ts                      # Next.js proxy (formerly middleware) for route protection
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration (if exists)
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd footballtalento
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
Copy the `.env.example` file to `.env.local` and update the values:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=https://docstec.site/wp-json/footballtalento/v1
# Update other variables as needed
```

> Note: The `.env.example` file contains all available configuration options with default values.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:

```bash
npm run build
npm run start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 🏗️ Architecture Overview

### App Router Structure

This project uses Next.js 16 App Router with the following patterns:

- **Pages:** Located in `app/` directory with `page.tsx` files
- **Layouts:** Shared layouts in `layout.tsx` files
- **Components:** Organized by feature in `app/components/`
- **API Integration:** Centralized in `lib/api/`
- **State Management:** Zustand stores in `store/`

### Authentication Flow

1. User registers/logs in through `/auth/login` or `/auth/register`
2. JWT tokens are managed via `lib/api/auth.ts`
3. Auth state is stored in Zustand (`store/authStore.ts`)
4. Protected routes are handled by Next.js proxy (`proxy.ts`)
5. `AuthProvider` wraps the app for global auth context

### Component Organization

- **Layout Components:** Reusable header and footer
- **Home Components:** Landing page sections (hero, features, rankings)
- **Feature Components:** Specialized components (player cards, rankings)
- **Providers:** Context providers for cross-cutting concerns

## 🎨 Styling

- **Tailwind CSS 4:** Utility-first CSS framework
- **Global Styles:** `app/globals.css` for custom styles
- **Component Styles:** Inline Tailwind classes
- **Responsive Design:** Mobile-first approach

## 🔐 Authentication

The platform includes a complete authentication system:

- User registration
- User login
- Password recovery (forgot password)
- Password reset
- Protected routes via middleware
- JWT token management

## 📦 Key Features

- **Player Rankings:** View and track player rankings
- **Club Rankings:** Browse top football clubs
- **Featured Players:** Showcase of talented players
- **Testimonials:** User reviews and feedback
- **Trusted Clubs:** Partner clubs showcase
- **Dashboard:** User dashboard for personalized experience

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

This app can also be deployed to:
- AWS Amplify
- Netlify
- DigitalOcean App Platform
- Self-hosted (Node.js server)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Quality

- **TypeScript:** Strict type checking enabled
- **ESLint:** Code linting with Next.js config
- **File Organization:** Feature-based component structure
- **Naming Conventions:** PascalCase for components, camelCase for utilities

## 📋 Environment Variables

The project uses environment variables for configuration. See `.env.example` for all available options:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint (required)
- Additional optional configuration variables are documented in `.env.example`

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
