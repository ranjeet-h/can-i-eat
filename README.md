# 🍎 Can I Eat

<div align="center">
  
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

The application aims to empower consumers by translating complex food labels into easy-to-understand information, supporting the "Label Padhega India" movement that encourages awareness about food product contents.

## ✨ Features

- 🔍 **Smart Search** - Find products by name, brand, or ingredient with autocomplete
- 🏷️ **Health Scores** - Visual health rating system based on ingredients and nutrition
- 🥗 **Dietary Information** - Quickly see if products match dietary preferences
- 📊 **Nutrition Visualization** - Easy-to-understand nutritional information
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode** - Easy on the eyes with beautiful Dracula-inspired theme
- 👥 **User Accounts** - Save favorite products and set dietary preferences
- 🤝 **Community Contributions** - Users can submit new products with verification workflow
- 🔄 **Product Comparison** - Compare nutritional values between similar products
- 👑 **Admin Dashboard** - Manage products, review contributions, and monitor platform

## 🚀 Technologies

- **Frontend**:

  - React with TypeScript
  - Vite for fast development
  - Tailwind CSS v4 for styling (with DaisyUI components)
  - HeadlessUI for accessible components
  - Framer Motion for animations
  - React Query for data fetching
  - Zustand for state management

- **Backend**:
  - Supabase (PostgreSQL)
  - Full-text search with trigram similarity
  - Row-level security for user data
  - Real-time subscriptions
  - Supabase Storage for product images
  - Authentication with social logins

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

   Edit `.env.local` with your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Initialize the database (sample data):

   ```bash
   npm run db:seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5173` to see the application.

## 📸 Screenshots

<div align="center">
  <p><em><b>Desktop View</b></em></p>
  <img src="src/screenshots/homepage-1.png" alt="Homepage Search" width="80%" />
  <p><em>Homepage with Search and Featured Products</em></p>
  
  <img src="src/screenshots/homepage-2.png" alt="Health Score Visualization" width="80%" />
  <p><em>Intuitive Health Score Visualization</em></p>
  
  <img src="src/screenshots/homepage-3.png" alt="Product Details" width="80%" />
  <p><em>Comprehensive Product Details with Nutritional Information</em></p>
  
  <img src="src/screenshots/animated-loader.png" alt="Animated Loader" width="80%" />
  <p><em>Interactive Loading Animation</em></p>

  <img src="src/screenshots/contribute-add-product.png" alt="Add Product Form" width="80%" />
  <p><em>Community Contribution: Add New Product Form</em></p>
  
  <img src="src/screenshots/admin-product-list.png" alt="Admin Product List" width="80%" />
  <p><em>Admin Dashboard: Product Management</em></p>
  
  <img src="src/screenshots/admin-add-product.png" alt="Admin Add Product" width="80%" />
  <p><em>Admin Dashboard: Add New Product</em></p>
  
  <img src="src/screenshots/admin-product-quick-links.png" alt="Admin Quick Links" width="80%" />
  <p><em>Admin Dashboard: Quick Action Links</em></p>
  
  <img src="src/screenshots/admin-db-product-contribution-review.png" alt="Contribution Review" width="80%" />
  <p><em>Admin Dashboard: Review User Contributions</em></p>

  <p><em><b>Mobile View</b></em></p>
  
  <table>
    <tr>
      <td align="center" width="300px">
        <img src="src/screenshots/homepage-mobile.png" alt="Mobile View" width="250px" />
        <p><em>Mobile View: Homepage Search</em></p>
      </td>
      <td align="center" width="300px">
        <img src="src/screenshots/contribute-add-product-mobile.png" alt="Mobile View" width="250px" />
        <p><em>Mobile View: Contribute Add Product</em></p>
      </td>
    </tr>
    <tr>
      <td align="center" width="300px">
        <img src="src/screenshots/submit-review-mobile.png" alt="Mobile View" width="250px" />
        <p><em>Mobile View: Review contribution</em></p>
      </td>
      <td align="center" width="300px">
        <img src="src/screenshots/admin-dashboard-mobile.png" alt="Mobile View" width="250px" />
        <p><em>Mobile View: Admin Dashboard</em></p>
      </td>
    </tr>
    <tr>
      <td align="center" colspan="2">
        <img src="src/screenshots/admin-add-product-mobile.png" alt="Mobile View" width="250px" />
        <p><em>Mobile View: Admin Add Product</em></p>
      </td>
    </tr>
  </table>
</div>

## 📁 Project Structure

```
can-i-eat/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable React components
│   │   ├── layout/     # Layout components (Header, Footer, etc.)
│   │   ├── search/     # Search components
│   │   ├── product/    # Product display components
│   │   ├── admin/      # Admin dashboard components
│   │   └── ui/         # Generic UI components
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.ts  # Authentication hooks
│   │   ├── useSearch.ts # Product search hooks
│   │   └── useProduct.ts # Product data hooks
│   ├── pages/          # Page components
│   │   ├── Home.tsx    # Homepage
│   │   ├── Product.tsx # Product details
│   │   ├── Search.tsx  # Search results
│   │   ├── Compare.tsx # Product comparison
│   │   ├── Admin.tsx   # Admin dashboard
│   │   └── Profile.tsx # User profile
│   ├── services/       # API services
│   │   └── supabase.ts # Supabase client
│   ├── store/          # Zustand stores
│   │   ├── authStore.ts # Authentication state
│   │   └── productStore.ts # Product state
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── supabase/           # Supabase configuration
│   ├── migrations/     # Database migrations
│   └── seed.sql        # Sample data seed
├── .env.example        # Example environment variables
├── demo_products.sql   # Demo product data
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🗄️ Database Schema

The application uses a PostgreSQL database (via Supabase) with the following structure:

- **Products**: Core product information (name, brand, barcode, etc.)
- **Ingredients**: List of ingredients per product with allergen flags
- **Nutrition**: Detailed nutritional values (calories, proteins, etc.)
- **Health_Ratings**: Computed health scores for different aspects
- **User_Profiles**: User preferences and saved products

The database employs special features:

- PostgreSQL's pg_trgm extension for fuzzy text search
- Full-text search vectors for optimal search performance
- Row-level security for user data protection
- Real-time subscriptions for live updates

## 🔄 Data Flow

1. **Search Process**:

   - User enters search query
   - Fuzzy text matching finds relevant products
   - Results are ranked by relevance
   - Cached for performance

2. **Health Score Calculation**:

   - Ingredients analyzed for additives
   - Nutritional values compared to recommended daily values
   - Processing level estimated from ingredient list
   - Combined into a simple visual score

3. **Product Submission**:
   - Community members can submit products
   - Admin review workflow ensures quality
   - Verified products marked in the UI

## 📝 Roadmap

- [ ] **Barcode Scanner**: Add camera integration for quick product lookup
- [ ] **Personalized Recommendations**: Based on dietary preferences
- [ ] **Nutrition Goal Tracking**: Monitor nutritional intake over time
- [ ] **Augmented Reality Label Scanner**: Point camera at product to get instant information
- [ ] **Advanced Comparison Tools**: Side-by-side nutrition visualization
- [ ] **Offline Mode**: Cache frequently accessed products for offline use
- [ ] **Mobile Apps**: Native iOS and Android applications
- [ ] **Regional Language Support**: Add Hindi and other Indian languages
- [ ] **FSSAI Database Integration**: Automatic updates from official source

## 👥 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the TypeScript coding conventions
- Add comments for complex logic
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Label Padhega India](https://labelpadheaindia.org/) movement for raising awareness
- [caniuse.com](https://caniuse.com/) for interface inspiration
- [Dracula Theme](https://draculatheme.com/) for color inspiration
- [Open Food Facts](https://world.openfoodfacts.org/) for database structure inspiration
- All the contributors who have helped shape this project

---

<div align="center">
  <p>Made with ❤️ in India</p>
  <p>© 2024 Can I Eat. All rights reserved.</p>
</div>

API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1

S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
S3 Region: local
