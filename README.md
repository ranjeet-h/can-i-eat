# Can I Eat

A modern React application for helping users determine dietary compatibility.

## Tech Stack

This production-grade application is built with:

- **React 19** - Latest version of React with TypeScript
- **Tailwind CSS v4** - Using the new CSS-first configuration approach
- **SCSS** - For custom styling beyond Tailwind
- **Zustand** - Simple, fast state management
- **Axios** - Promise-based HTTP client
- **React Query** - Data fetching, caching, and state management
- **Vite** - Fast build tooling

## Project Structure

```
src/
├── assets/
│   └── styles/      # SCSS styles
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Application pages/routes
├── services/        # API services
├── store/           # Zustand store
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Tailwind CSS v4 Features

This project utilizes Tailwind CSS v4's new features:

- CSS-based configuration with `@theme` directive
- CSS variables for all design tokens
- Native CSS cascade layers with `@layer`
- Container query support
- Dark mode via CSS class

## State Management

We use Zustand for state management with:

- Persistent storage using the `persist` middleware
- Type-safe store with TypeScript
- Automatic dark mode detection and synchronization

## API Integration

- Axios for API requests with interceptors
- React Query for data fetching and cache management
- Type-safe API response handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
