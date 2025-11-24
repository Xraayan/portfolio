# Adithyan's Portfolio

A modern, responsive portfolio built with React, Vite, and Tailwind CSS featuring particle animations and smooth transitions.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
portfv2/
├── src/
│   ├── Landing.jsx      # Main landing page component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## Features

- ⚡ Fast development with Vite
- 🎨 Tailwind CSS for styling
- ✨ tsParticles for background animations
- 📱 Fully responsive design
- 🎭 Smooth animations and transitions
- 🔗 Social media integration

## Potential Issues & Solutions

### Icon Fonts
- **Issue:** FontAwesome icons may not load if CDN is blocked
- **Solution:** Icons are loaded from CDN in index.html. If needed, install locally with `npm install @fortawesome/fontawesome-free`

### tsParticles
- **Issue:** Particles may cause performance issues on slower devices
- **Solution:** Particles are initialized with a 100ms delay and optimized settings (30 FPS limit, reduced particle count)

### Tailwind Configuration
- **Issue:** Custom colors/fonts not working
- **Solution:** Ensure tailwind.config.js includes all source files in content array

### Build Issues
- **Issue:** Build failures due to missing dependencies
- **Solution:** Run `npm install` to ensure all dependencies are installed

## Browser Support

- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+