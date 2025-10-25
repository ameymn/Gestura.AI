# Gestura Design Guidelines

## Design Approach

**Selected Framework**: Material Design (Google) with custom accessibility enhancements
**Rationale**: Gestura serves diverse users—children, teachers, and parents—in an educational/assistive context. Material Design provides accessibility-first components, clear visual feedback, and established patterns for data-dense applications. Custom elements will address the unique real-time gesture notification system.

**Core Principles**:
- Accessibility First: WCAG 2.1 AA compliance minimum, optimized for cognitive and motor accessibility
- Trust & Clarity: Professional yet warm aesthetic appropriate for educational settings
- Immediate Feedback: Real-time events must be instantly recognizable
- Inclusive Design: Interface works for children, educators, and parents with varying technical abilities

---

## Typography System

**Font Stack**:
- **Primary**: Inter (Google Fonts) - Excellent readability, accessible letterforms
- **Accent**: Poppins (Google Fonts) - Friendly, approachable for headings

**Hierarchy**:
- **Display (Hero/Page Titles)**: 
  - Desktop: text-5xl, font-bold (Poppins)
  - Mobile: text-4xl, font-bold
- **H1 (Section Headers)**: text-3xl, font-semibold (Poppins)
- **H2 (Subsections)**: text-2xl, font-medium (Poppins)
- **H3 (Card Titles)**: text-xl, font-semibold (Inter)
- **Body (Primary)**: text-base, font-normal, leading-relaxed (Inter)
- **Body (Secondary/Meta)**: text-sm, font-normal, leading-normal (Inter)
- **Alerts/Notifications**: text-lg, font-medium (Inter) for immediate readability
- **Button Text**: text-base, font-medium, uppercase tracking-wide for accessibility

---

## Layout System

**Spacing Primitives**: 
Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Micro spacing: p-2, m-2 (buttons, inline elements)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section spacing: py-8, px-6 (mobile), py-12, px-8 (desktop)
- Major sections: py-16 (desktop dashboards)

**Grid Structure**:
- **Mobile Sensor Page**: Single column, centered, max-w-md
- **Teacher Dashboard**: 
  - Header with logo/navigation
  - Live notification feed (full-width or 2-column on desktop)
  - Persistent "Active Gestures" sidebar (desktop only, lg:grid-cols-[1fr_300px])
- **Parent Dashboard**: 
  - Grid layout for metrics cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Chart section: Full-width container with max-w-4xl
  - Summary section: max-w-prose for readability

**Container Strategy**:
- Dashboard pages: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Mobile sensor: max-w-md mx-auto for focused interaction
- Content sections: Ample padding (px-6 to px-8) for breathing room

---

## Component Library

### Navigation
- **Header Bar**: Fixed top navigation with logo, page title, user indicator
- Minimal menu: "Sensor | Teacher | Parent" navigation links
- Rounded corner design (rounded-lg) for approachability
- Sufficient touch targets (min-h-16) for accessibility

### Mobile Sensor Interface
- **Gesture Detection Card**: 
  - Large, centered card (rounded-2xl, p-8)
  - Animated visual indicator showing device motion state (SVG circle that responds to movement)
  - Clear instruction text: "Move your device to send a gesture"
  - Status indicator showing connection state
  - Large "Send Gesture" button with icon (min-h-14, rounded-full)
  - Student name selector dropdown (rounded-lg, p-4)
  - Visual feedback on gesture sent (checkmark animation)

### Teacher Dashboard - Real-time Components
- **Live Notification Cards**:
  - Prominent cards that appear with slide-in animation
  - Large student name (text-2xl, font-bold)
  - Gesture type badge (rounded-full, px-4, py-2)
  - Translated message in large text (text-xl)
  - Timestamp (text-sm, opacity-70)
  - Auto-dismiss after 10 seconds with fade-out
  - Stack vertically with newest on top, max 5 visible
  - Icons from Heroicons (speaker icon for TTS)

- **Active Gestures Sidebar** (Desktop):
  - Scrollable list of today's gestures
  - Compact card design (p-4, rounded-lg)
  - Student avatar placeholder (w-10, h-10, rounded-full)
  - Gesture count badge

### Parent Dashboard - Analytics Components
- **Metrics Cards Grid**:
  - Four key metrics: Total Gestures, Recognized Rate, Most Active Time, Weekly Change
  - Card design: rounded-xl, p-6, shadow-md
  - Large number display (text-4xl, font-bold)
  - Descriptive label (text-sm, opacity-80)
  - Icon indicator (w-12, h-12) using Heroicons
  - Percentage change badge with trend arrow

- **Progress Chart**:
  - Weekly bar chart container (rounded-xl, p-6)
  - Clear axis labels and grid lines
  - Bar width: Generous spacing for readability
  - Accessible tooltips on hover
  - Chart title (text-2xl, font-semibold)
  - Simple legend with rounded-sm indicators

- **Summary Section**:
  - Narrative text card (rounded-xl, p-8, max-w-prose)
  - Quote-style design with icon
  - Larger body text (text-lg, leading-relaxed)
  - Parent-friendly language highlighting child's progress

### Form Elements & Inputs
- **Dropdowns**: Rounded-lg, p-3, border-2, min-h-12
- **Buttons**: 
  - Primary: rounded-lg, px-6, py-3, font-medium, shadow-sm
  - Large CTA: rounded-xl, px-8, py-4, text-lg
  - Icon buttons: rounded-full, w-12, h-12
- **Text Inputs**: rounded-lg, p-4, border-2, focus ring-2

### Status Indicators
- **Connection Status Dot**: 
  - Pulsing animation for "connected"
  - w-3, h-3, rounded-full
  - Positioned in header
- **Gesture Type Badges**: 
  - Pill shape (rounded-full, px-4, py-1.5)
  - Icon + text combination
  - Different visual treatments per gesture type

### Accessibility Features
- **Focus States**: Always visible 2-3px focus rings with offset
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Screen Reader Text**: Visually hidden labels for all icons
- **Reduced Motion**: Respect prefers-reduced-motion, provide static alternatives
- **High Contrast**: Ensure 4.5:1 contrast minimum for all text

---

## Animation Strategy (Minimal & Purposeful)

**Use Animation Only For**:
1. **Gesture Detection Feedback** (Mobile): Subtle scale/bounce on successful gesture send
2. **New Notification Entry** (Teacher): Slide-in from right with gentle ease-out (300ms)
3. **Loading States**: Simple spinner (Heroicons) for data fetching
4. **Success Confirmation**: Checkmark with scale animation (200ms)

**Avoid**: Continuous animations, parallax effects, complex transitions

---

## Image Guidelines

**Images Section**:
- **Teacher/Parent Dashboard Hero** (Optional): 
  - Small hero banner (h-32 to h-48) with abstract geometric pattern or education-themed illustration
  - Position: Top of dashboard page, not full viewport
  - Purpose: Visual warmth and brand identity
  - If using image: Buttons overlaid should have backdrop-blur-md treatment
  
- **Student Avatar Placeholders**: 
  - Colorful gradient circles with initials
  - Generate programmatically, not actual images
  
- **Gesture Icons**: 
  - Use Heroicons exclusively: hand-raised, bell, play, pause icons
  - SVG format for scalability

**No large hero images required** - This is a utility-focused application where clarity and speed matter most.

---

## Responsive Behavior

**Breakpoints**:
- Mobile (base): Single column, stacked layout, bottom navigation consideration
- Tablet (md: 768px): 2-column grids for metrics, larger touch targets
- Desktop (lg: 1024px): Multi-column layouts, sidebar navigation, expanded data tables

**Mobile-Specific**:
- Sensor page: Full-screen card for gesture detection, minimal chrome
- Teacher dashboard: Vertical notification feed, no sidebar
- Parent dashboard: Stacked metrics cards, simplified chart

**Desktop-Specific**:
- Teacher dashboard: Persistent sidebar with gesture history
- Parent dashboard: 3-column metrics grid, larger chart with more data points
- Enhanced data tables with sorting/filtering

This design creates a trustworthy, accessible, and efficient interface that serves children, teachers, and parents with clarity and purpose. The aesthetic balances professionalism with warmth, ensuring the platform feels supportive rather than clinical.