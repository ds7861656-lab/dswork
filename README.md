# AfreshTrip

A modern, full-featured travel blog platform built with React, TypeScript, and Vite. Share your travel stories, discover amazing destinations, and connect with fellow travelers through rich blog content, user authentication, and multilingual support.

## 🌟 Features

### Blog Management
- **Rich Text Editor**: Block-based editor with support for headings, paragraphs, lists, links, images, videos, quotes, code blocks, and more
- **Blog Posts**: Create, edit, and publish travel stories with categories, tags, and featured images
- **Search & Filter**: Advanced search functionality with category filtering and sorting options (newest, oldest, popular)
- **Pagination**: Efficient loading of blog posts with pagination support
- **Comments System**: Engage readers with a comment section on blog posts
- **Social Sharing**: Share blog posts across social media platforms

### User Experience
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark/Light Mode**: Theme switching capability (via Tailwind CSS)
- **Internationalization**: Multi-language support (English, Spanish, French)
- **Newsletter Subscription**: Email newsletter signup for travel tips and stories
- **Photo Library**: Integrated photo library for blog post images

### User Authentication
- **Firebase Authentication**: Secure user authentication with email/password and Google sign-in
- **Protected Routes**: Secure access to user-specific features like blog creation
- **User Profiles**: Personalized user profiles and dashboard
- **Subscription Management**: User subscription and notification preferences

### Content Features
- **Gallery Cards**: Beautiful card layouts for blog post previews
- **Related Posts**: Smart recommendations based on categories
- **Table of Contents**: Auto-generated TOC for long blog posts
- **Author Bios**: Detailed author information and social links
- **View/Like/Save**: Social engagement features for blog posts

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form
- **Internationalization**: React i18next
- **Icons**: Heroicons (via SVG)
- **Code Quality**: ESLint with TypeScript support

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase project (for authentication)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sophie-is-me/afreshtrip-frontend.git
   cd afreshtrip-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Copy your Firebase config to `lib/firebase/client.ts`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── blocks/         # Blog editor blocks (Image, Video, Quote, etc.)
│   └── ...             # Other components (Header, Footer, Cards, etc.)
├── contexts/           # React contexts (Auth, Blog)
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization files
│   └── locales/        # Translation files (en, es, fr)
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎯 Usage

### Creating Blog Posts
1. Log in to your account
2. Navigate to the blog editor (`/blog/create`)
3. Add a title and featured image
4. Use the rich text editor to compose your content
5. Add categories and tags
6. Publish or save as a draft
7. N.B: To switch between the Chinese Version and the old version, change the .env file and set VITE_IS_CHINESE_VERSION=false

### Browsing Content
- Visit the blog page to explore posts
- Use search and filters to find specific content
- Click on posts to read full articles
- Engage with content through likes, saves, and comments

### User Management
- Register/Login with email or Google
- Access your dashboard for personalized content
- Manage subscriptions and notifications

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

The project uses ESLint with TypeScript support. Run `npm run lint` to check for code issues.

### Internationalization

Translations are managed in the `src/i18n/locales/` directory. Add new languages by creating new locale folders and updating the i18n configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and TypeScript
- Styled with Tailwind CSS
- Icons from Heroicons
- Authentication powered by Firebase
