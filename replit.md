# Gestura - AI-Powered Assistive Communication Platform

## Overview

Gestura is an AI-for-Good assistive technology platform that converts children's personalized gestures into classroom communication. The application enables students (particularly those with communication challenges) to use mobile device motion sensors to trigger pre-defined messages that are broadcast in real-time to teachers and tracked for parents.

**Key Features:**
- Mobile sensor simulation for capturing gesture events (wave, shake, tilt)
- Real-time teacher dashboard with WebSocket-based notifications and text-to-speech
- Parent analytics dashboard with weekly progress tracking and insights
- Material Design-inspired UI with accessibility-first approach (WCAG 2.1 AA compliance)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System:**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Material Design principles** with custom accessibility enhancements
- Typography: Inter (body) and Poppins (headings) from Google Fonts

**Design System:**
- Custom CSS variables for theming (defined in `client/src/index.css`)
- Consistent spacing scale using Tailwind units (2, 4, 6, 8, 12, 16)
- Accessible color contrast ratios and focus indicators
- Responsive layouts optimized for mobile-first sensor interface

**Key Pages:**
1. **Sensor Page** (`/`) - Mobile motion sensor simulator using `DeviceMotionEvent` API
2. **Teacher Dashboard** (`/teacher`) - Real-time gesture feed with WebSocket updates and TTS
3. **Parent Dashboard** (`/parent`) - Analytics with Recharts visualizations

### Backend Architecture

**Server Framework:**
- **Express.js** with TypeScript running on Node.js
- **http** module creating the base server for both HTTP and WebSocket

**Real-Time Communication:**
- **WebSocket (ws library)** for bidirectional real-time updates
- Custom WebSocket server mounted at `/ws` path (separate from Vite HMR)
- Broadcast pattern: All connected clients receive gesture events instantly

**Data Storage:**
- **In-Memory Storage** (`MemStorage` class) for MVP implementation
- Schema defined with Drizzle ORM types for future PostgreSQL migration
- Data structures support gesture tracking, daily/weekly queries, and analytics

**API Design:**
- RESTful endpoints prefixed with `/api`:
  - `POST /api/gestures` - Submit new gesture events
  - `GET /api/gestures/today` - Retrieve today's gestures
  - `GET /api/analytics` - Compute and return parent dashboard metrics
- JSON request/response format with Zod schema validation

**Data Flow:**
1. Mobile device captures motion → validates against baseline threshold
2. Gesture classified client-side (wave/shake/tilt → message mapping)
3. POST request to `/api/gestures` with student name, gesture type, message
4. Server validates via Zod schema, stores in memory, broadcasts via WebSocket
5. Teacher dashboard receives WebSocket event, updates UI, triggers TTS
6. Parent dashboard polls `/api/analytics` for aggregated weekly data

### Database Schema (Prepared for PostgreSQL)

**Gestures Table:**
- `id` (UUID primary key, auto-generated)
- `studentName` (text) - Student identifier
- `gestureType` (text) - Raw gesture classification (wave, shake, tilt)
- `message` (text) - Human-readable message (e.g., "Needs Help", "Wants Break")
- `timestamp` (timestamp with default now)

**Migration Strategy:**
- Drizzle ORM configured for PostgreSQL in `drizzle.config.ts`
- Current implementation uses in-memory storage matching schema structure
- Future migration path: Replace `MemStorage` with Drizzle queries to Neon/PostgreSQL

### External Dependencies

**Third-Party Services:**
- **Neon Database** (configured but not actively used) - Serverless PostgreSQL for production
- **Web Speech API** (browser native) - Text-to-speech for teacher notifications
- **DeviceMotion API** (browser native) - Mobile sensor access for gesture detection

**Key NPM Packages:**
- `drizzle-orm` + `@neondatabase/serverless` - Database ORM and driver
- `ws` - WebSocket server implementation
- `zod` - Runtime schema validation
- `react-hook-form` + `@hookform/resolvers` - Form state management
- `recharts` - Data visualization for parent analytics
- `date-fns` - Date manipulation for weekly analytics
- `class-variance-authority` + `clsx` - Component variant styling utilities

**Development Tools:**
- TypeScript strict mode enabled
- ESBuild for server bundling in production
- Vite plugins: Replit-specific overlays and dev tools

### Authentication & Authorization

**Current State:** No authentication implemented (MVP scope)

**Future Considerations:**
- Role-based access control needed (student, teacher, parent roles)
- Session management via `connect-pg-simple` (already installed)
- Potential OAuth integration for school district SSO

### Gesture Classification Logic

**Current Implementation:**
- Client-side acceleration threshold detection (±3 units from baseline)
- Hardcoded gesture-to-message mappings:
  - Wave → "Needs Help"
  - Shake → "Wants to Speak"
  - Tilt → "Needs a Break"

**ML Extension Path:**
- Comments indicate future TensorFlow.js integration
- Custom gesture training per student (personalization)
- Server-side model inference vs. edge deployment decision needed