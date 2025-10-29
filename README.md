# Gestura - AI-Powered Assistive Communication Platform

<img src="client/public/favicon.png" alt="Gestura Logo" width="96" style="height:auto;" />

## Overview

Gestura is an AI-for-Good assistive technology platform developed during the "AI For Good" Hackathon at University at Buffalo. It converts children's personalized gestures into classroom communication, enabling students with communication challenges to express their needs effectively using mobile device motion sensors.

## Key Features

- **Motion-Based Communication**: Uses device sensors to detect three gesture types:
  - Wave → "Needs Help"
  - Shake → "Ready to Answer"
  - Tilt → "Wants Break"
- **Real-Time Teacher Dashboard**: 
  - Live WebSocket updates
  - Text-to-Speech notifications
  - Instant gesture recognition feedback
- **Parent Analytics Dashboard**:
  - Daily activity tracking
  - Weekly progress visualization
  - Personalized insights and summaries
- **Accessibility-First Design**:
  - Responsive interface

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- shadcn/ui components
- Tailwind CSS for styling

### Backend
- Express.js server
- WebSocket for real-time communication
- Zod for schema validation

## Getting Started

### Prerequisites
```bash
node >= 16.0.0
npm >= 8.0.0
```

### Installation
```bash
# Clone the repository
git clone https://github.com/ameymn/Gestura.AI.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Route components
│   │   └── hooks/        # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts         # API routes
│   └── index.ts          # Server setup and WebSocket handlers
├── shared/               # Shared types and utilities
└── attached_assets/      # Project assets
```

## Deployment

The application is deployed on DigitalOcean App Platform and can be accessed at:
https://seal-app-53n75.ondigitalocean.app/



## Contributing

This project was developed during a hackathon! Please feel free to submit issues and pull requests.

## Team

- Amey Managute
- Anirudh Mhaske

AI For Good Hackathon FALL 2025


