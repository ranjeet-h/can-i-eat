# 🍎 Can I Eat

<div align="center">
  
  ![Can I Eat Logo](https://via.placeholder.com/150/44475a/f8f8f2?text=Can+I+Eat)
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.0-646cff.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38b2ac.svg)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.39.2-24cc63.svg)](https://supabase.io/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  **Supporting the "Label Padhega India" movement by helping consumers make informed food choices**
</div>

## 📖 About

**Can I Eat** is a web application similar to "caniuse.com" but focused on packaged food products in India. The platform helps consumers make informed food choices through easily accessible information about ingredients, nutritional values, and potential allergens in food products.

Users can search for food products by name, brand, or ingredients and quickly see:
- Overall health rating with visual indicators
- Detailed ingredient lists
- Nutritional information in a clear format
- Dietary compatibility (vegan, vegetarian, gluten-free, etc.)
- Potential alternatives for healthier options

## ✨ Features

- 🔍 **Smart Search** - Find products by name, brand, or ingredient with autocomplete
- 🏷️ **Health Scores** - Visual health rating system based on ingredients and nutrition
- 🥗 **Dietary Information** - Quickly see if products match dietary preferences
- 📊 **Nutrition Visualization** - Easy-to-understand nutritional information
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode** - Easy on the eyes with beautiful Dracula-inspired theme

## 🚀 Technologies

- **Frontend**:
  - React with TypeScript
  - Vite for fast development
  - Tailwind CSS v4 for styling
  - Framer Motion for animations
  - React Query for data fetching
  - Zustand for state management

- **Backend**:
  - Supabase (PostgreSQL)
  - Full-text search
  - Authentication

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/can-i-eat.git
   cd can-i-eat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173` to see the application.

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x450/44475a/f8f8f2?text=Home+Screen" alt="Home Screen" width="80%" />
  <p><em>Home Screen with Search</em></p>
  
  <img src="https://via.placeholder.com/800x450/44475a/f8f8f2?text=Product+Details" alt="Product Details" width="80%" />
  <p><em>Product Details with Health Score</em></p>
  
  <img src="https://via.placeholder.com/800x450/44475a/f8f8f2?text=Search+Results" alt="Search Results" width="80%" />
  <p><em>Search Results with Filtering</em></p>
</div>

## 📁 Project Structure

```
can-i-eat/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Zustand store
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env.example        # Example environment variables
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 📝 Roadmap

- [ ] Barcode scanning for quick product lookup
- [ ] User accounts for saving favorite products
- [ ] Nutritional comparison between similar products
- [ ] Crowdsourced product information
- [ ] Mobile app for iOS and Android

## 👥 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Label Padhega India](https://labelpadheaindia.org/) movement for raising awareness
- [caniuse.com](https://caniuse.com/) for interface inspiration
- [Dracula Theme](https://draculatheme.com/) for color inspiration
- All the contributors who have helped shape this project

---

<div align="center">
  <p>Made with ❤️ in India</p>
  <p>© 2024 Can I Eat. All rights reserved.</p>
</div>
