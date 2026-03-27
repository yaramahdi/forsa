# منصة فُرصة - Forsa Platform

A modern React + Vite web application for connecting craftspeople with customers. This platform uses a beautiful UI with Arabic language support (RTL) and responsive design.

## 🎨 Features

- **React Components System**: Modular, reusable components
- **Word-by-Word Fade Animation**: Hero section title animates word by word with 400ms delays
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Arabic Language Support**: Full RTL (Right-to-Left) layout support
- **Modern Stack**: Built with React 18, Vite, and modern CSS
- **Beautiful Colors**: Navy Blue (#1B3D5F), Yellow (#F9C52E), and Green (#28a745)

## 📐 Project Structure

```
Forsa/
├── index.html              # Main HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main App component
│   ├── App.css             # Global styling
│   └── components/
│       ├── Navbar.jsx      # Navigation header
│       ├── Hero.jsx        # Hero section with animation
│       ├── Categories.jsx  # Craftsperson categories
│       ├── Specialists.jsx # Featured specialists
│       └── Footer.jsx      # Footer component
├── images/                 # Images and assets
└── icons/                  # Icon assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Forsa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:5173`

### Build for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 📦 Dependencies

- **react**: ^18.2.0 - React library
- **react-dom**: ^18.2.0 - React DOM rendering

## 🔧 Dev Dependencies

- **@vitejs/plugin-react**: ^4.2.1 - React plugin for Vite
- **vite**: ^5.0.8 - Build tool and dev server

## 🎯 Components

### Navbar
Navigation header with:
- Logo on the right (RTL)
- Contact Us link
- Create Account button
- Log In button

### Hero
Dynamic hero section featuring:
- Fade-in word-by-word animation (400ms between words)
- Animated title: "من الرُّكام.. نبني الأحلام" (From the rubble... we build dreams)
- Search bar for craftspeople
- Background image

### Categories
Grid layout displaying five craft categories:
- مهندس (Engineer)
- سباك (Plumber)
- دهان (Painter)
- نجار (Carpenter)
- كهربائي (Electrician)

### Specialists
Cards showcasing featured craftspeople with:
- Profile icons
- Name and profession
- 5-star ratings
- "More" button for additional specialists

### Footer
Copyright information and site branding

## 🎨 Color Scheme

- **Navy Blue**: #1B3D5F (Primary)
- **Yellow**: #F9C52E (Accent)
- **Green**: #28a745 (Buttons)
- **Cream**: #FDFCF0 (Background)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🌐 Language & Direction

- **Language**: Arabic (RTL)
- **Font**: Cairo (Google Fonts)
- **Direction**: Right-to-Left

## 🔄 Key Features Implementation

### Word-by-Word Animation
The Hero component uses React hooks (`useState` and `useEffect`) to animate the title word by word:
- Each word appears with a 400ms delay
- Smooth fade-in and slide-up animation
- Last word ("الأحلام") highlighted in yellow

```javascript
useEffect(() => {
  words.forEach((word, index) => {
    setTimeout(() => {
      setVisibleWords(prev => [...prev, index])
    }, index * 400)
  })
}, [])
```

## 📄 License

© 2026 جميع الحقوق محفوظة لمنصة فُرصة

---
 
