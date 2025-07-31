# Coca App Unity - Complete Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Philosophy](#architecture-philosophy)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [Component System](#component-system)
6. [Navigation Flow](#navigation-flow)
7. [Design System](#design-system)
8. [Data Flow](#data-flow)
9. [Key Features](#key-features)
10. [Development Guidelines](#development-guidelines)

## Project Overview

**Coca App Unity** is a goal-tracking and habit-building React Native application designed to help users achieve their ambitions through structured goal setting, daily actions, and community support.

### 🎯 Deployment Target
**PRIMARY**: iOS App Store deployment
- The app MUST maintain 100% iOS compatibility
- All features must work on physical iPhone devices
- Web and Android are secondary targets

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Styling**: Custom theme system with glass morphism design (no Tailwind/NativeWind)
- **Platforms**: iOS (primary), Android, Web
- **Components**: React Native built-in components only (no web-specific components)

## Architecture Philosophy

The app follows the **Coca App Frontend Architecture Manifesto** (`a.md`), which emphasizes:

1. **Modularity First**: Every component is self-contained and reusable
2. **Visual Isolation**: Components can be developed/tested in isolation
3. **Safe Refactoring**: Changes in one module don't break others
4. **Atomic Design**: UI built from smallest elements up
5. **No Tight Coupling**: Clean interfaces between all modules

## Project Structure

```
Unity/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedGradient.tsx
│   │   ├── Button.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── TextField.tsx
│   │   └── ...
│   ├── screens/            # Screen components
│   │   ├── onboarding/     # Onboarding flow screens
│   │   ├── modals/         # Modal screens (using React Native Modal)
│   │   │   ├── shareActionModal.tsx
│   │   │   ├── dailyReviewModal.tsx
│   │   │   └── goalAnnouncementModal.tsx
│   │   ├── dailyScreen.tsx
│   │   ├── socialScreen.tsx
│   │   ├── progressScreen.tsx
│   │   └── profileScreen.tsx
│   ├── layouts/            # Layout wrappers
│   │   └── ScreenLayout.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── appNavigator.tsx
│   ├── state/              # State management
│   │   └── appStore.ts
│   ├── themes/             # Design system
│   │   ├── theme.ts
│   │   └── theme.matrix.ts
│   ├── constants/          # App constants
│   └── utils/              # Utility functions
├── App.tsx                 # Root component
├── a.md                    # Architecture manifesto
├── ARCHITECTURE.md         # This file
└── package.json
```

## State Management

### Zustand Store Structure (`app/state/appStore.ts`)

```typescript
interface AppState {
  // App State
  appState: 'loading' | 'setup' | 'main'
  currentScreen: 'social' | 'daily' | 'progress' | 'profile'
  currentStep: number
  
  // User Data
  user: {
    id: string
    name: string
    email: string
    avatar: string
    todayStreak: number
    totalPoints: number
  }
  
  // Goal Management
  selectedGoal: string
  goalMetric: string
  goalDeadline: Date | null
  goalWhy: string
  userGoals: Goal[]
  
  // Actions & Habits
  userActions: Action[]
  checkedActions: Record<string, boolean>
  
  // UI State
  selectedSharingOption: 'public' | 'private'
  showShareModal: boolean
  showGoalAnnouncementModal: boolean
  showDailyReviewModal: boolean
  
  // Actions
  setSelectedGoal: (goal: string) => void
  lockInGoal: () => void
  toggleAction: (actionId: string) => void
  completeSetup: () => void
  // ... more actions
}
```

### State Update Patterns

```typescript
// Simple state update
setSelectedGoal: (goal) => set({ selectedGoal: goal })

// Complex state update with logic
toggleAction: (actionId) => set((state) => ({
  checkedActions: {
    ...state.checkedActions,
    [actionId]: !state.checkedActions[actionId]
  }
}))

// Navigation state update
completeSetup: () => set((state) => ({
  currentStep: 0,
  appState: 'main'
}))
```

## Component System

### Component Categories

1. **Atomic Components** (`app/components/`)
   - Basic building blocks
   - No business logic
   - Purely presentational
   - Examples: Button, TextField, Card
   - NOTE: Custom Modal wrappers (Modal.tsx, ModalPortal.tsx) have been removed in favor of React Native's built-in Modal

2. **Screen Components** (`app/screens/`)
   - Full page views
   - Integrate multiple components
   - Connect to app state
   - Handle user interactions

3. **Layout Components** (`app/layouts/`)
   - Provide consistent structure
   - Handle common screen needs
   - Examples: ScreenLayout (gradient background + safe area)

4. **Modal Components** (`app/screens/modals/`)
   - **IMPORTANT**: Always built using React Native's built-in Modal component
   - Never create custom modal implementations
   - Consistent bottom-sheet style with glass morphism
   - Platform-specific styling and constraints
   - Examples: ShareActionModal, DailyReviewModal, GoalAnnouncementModal

### Component Patterns

#### Glass Morphism Components
```typescript
// GlassCard - Reusable glass effect container
<GlassCard 
  variant="light"      // light | dark
  intensity={90}       // blur intensity
  padding="lg"         // spacing preset
>
  {children}
</GlassCard>

// GlassButton - Gradient button with glass variants
<GlassButton
  title="Continue"
  variant="solid"      // solid | glass | outline
  gradient={theme.gradient.vibrant}
  size="lg"
  onPress={handlePress}
/>
```

#### Animated Components
```typescript
// AnimatedGradient - Moving gradient background
<AnimatedGradient
  colors={theme.gradient.cosmic}
  animate={true}
  speed={10000}
/>

// ProgressRing - Animated circular progress
<ProgressRing
  progress={75}
  size={100}
  strokeWidth={10}
  color="#FF006E"
  showPercentage
/>
```

## Navigation Flow

### Navigation Structure
```
Root Navigator (Stack)
├── Onboarding Flow (Stack)
│   ├── GoalSetupScreen
│   ├── PerformanceHabitsScreen
│   ├── MilestonesScreen
│   └── ActionsSetupScreen
└── Main App (Tab)
    ├── Social (+ ShareActionModal)
    ├── Daily (+ DailyReviewModal)
    ├── Progress
    └── Profile
```

### Navigation State Management
- Navigation state is controlled by `appState` in Zustand
- `appState: 'setup'` → Shows onboarding flow
- `appState: 'main'` → Shows main tab navigator
- Current onboarding step tracked by `currentStep`

### Custom Tab Bar
```typescript
// Beautiful animated tab bar with gradient active states
const CustomTabBar = ({ state, descriptors, navigation }) => {
  // Custom implementation with:
  // - Animated icons
  // - Gradient backgrounds for active tabs
  // - Glass morphism effects
}
```

## Design System

### Theme Structure (`app/themes/theme.ts`)

```typescript
export const theme = {
  // Colors
  color: {
    primary: '#FF006E',
    secondary: '#8338EC',
    tertiary: '#3A86FF',
    
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F7',
      tertiary: '#E5E5E7',
    },
    
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    
    glass: {
      light: 'rgba(255, 255, 255, 0.7)',
      medium: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(0, 0, 0, 0.5)',
    }
  },
  
  // Gradients
  gradient: {
    vibrant: ['#FF006E', '#8338EC', '#3A86FF'],
    sunset: ['#FF006E', '#FF8E53'],
    aurora: ['#00C9FF', '#92FE9D'],
    cosmic: ['#667EEA', '#764BA2', '#F093FB'],
    fire: ['#F83600', '#F9D423'],
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Typography
  font: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 40,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  
  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  }
}
```

### Design Patterns

1. **Glass Morphism**
   - Semi-transparent backgrounds
   - Blur effects (platform-specific)
   - Subtle borders and shadows

2. **Gradients**
   - Used for buttons, backgrounds, accents
   - Consistent color combinations
   - Animated gradients for visual interest

3. **Animations**
   - Spring animations for interactions
   - Fade/slide for screen transitions
   - Scale effects for touch feedback

## Data Flow

### User Journey Data Flow

1. **Onboarding Flow**
   ```
   GoalSetupScreen → Set goal, metric, deadline
   ↓
   PerformanceHabitsScreen → Add habits for consistency
   ↓
   MilestonesScreen → Break goal into milestones
   ↓
   ActionsSetupScreen → Create specific daily actions
   ↓
   completeSetup() → Transition to main app
   ```

2. **Daily Usage Flow**
   ```
   DailyScreen → View today's actions
   ↓
   toggleAction() → Check off completed items
   ↓
   openSMSFlow() → Daily reflection
   ↓
   Update progress → Reflected across app
   ```

3. **Social Interaction Flow**
   ```
   SocialScreen → View community updates
   ↓
   shareAction() → Share achievement
   ↓
   ShareActionModal → Compose update
   ↓
   Post update → Visible to community
   ```

### Data Models

```typescript
interface Goal {
  id: string
  title: string
  metric: string
  deadline: Date
  milestones: Milestone[]
  progress: number
}

interface Action {
  id: string
  goalId: string
  name: string
  type: 'goal' | 'performance'
  schedule?: string
  frequency?: 'daily' | 'weekly'
}

interface Milestone {
  name: string
  date: Date
  completed: boolean
}
```

## Key Features

### 1. Goal Setting System
- Guided goal creation with presets
- Measurable metrics requirement
- Deadline setting with date picker
- Public/private sharing options

### 2. Action Management
- Daily action checklist
- Goal-specific and performance actions
- Progress tracking
- Visual completion indicators

### 3. Progress Visualization
- Circular progress rings
- Statistics dashboard
- Personal and group views
- Streak tracking

### 4. Social Features
- Instagram-style story circles
- Community feed
- Achievement sharing
- Reaction system

### 5. Profile & Achievements
- User statistics
- Achievement badges
- Habit tracking
- Activity history

## Development Guidelines

### 🚨 iOS Compatibility Requirements

**EVERY new feature MUST be iOS-compatible for App Store deployment**

Before implementing ANY feature:
1. Check if all dependencies support iOS
2. Test on iOS simulator/device
3. Ensure no web-only APIs are used
4. Verify gesture handlers work on touch devices

### Adding New Features

1. **New Screen**
   ```typescript
   // 1. Create screen component in app/screens/
   // 2. Add to navigation in appNavigator.tsx
   // 3. Add state management in appStore.ts
   // 4. Use ScreenLayout for consistency
   // 5. TEST ON iOS SIMULATOR
   ```

2. **New Component**
   ```typescript
   // 1. Create in app/components/
   // 2. Use theme tokens, no hardcoded values
   // 3. Make it reusable and testable
   // 4. Add TypeScript interfaces
   // 5. Ensure iOS compatibility (no web-only features)
   ```

3. **New State**
   ```typescript
   // 1. Add to AppState interface
   // 2. Add initial value
   // 3. Create setter action
   // 4. Keep state minimal
   // 5. Consider iOS app lifecycle
   ```

### Best Practices

1. **Always use theme tokens**
   ```typescript
   // Good
   color: theme.color.primary
   padding: theme.spacing.md
   
   // Bad
   color: '#FF006E'
   padding: 16
   ```

2. **Platform-specific code**
   ```typescript
   // Handle web vs native differences
   if (Platform.OS === 'web') {
     // Web-specific implementation
   } else {
     // Native implementation
   }
   ```

3. **Animation performance**
   ```typescript
   // Always use native driver when possible on native platforms
   useNativeDriver: Platform.OS !== 'web'
   ```

4. **Component composition**
   ```typescript
   // Build complex UI from simple components
   <ScreenLayout>
     <GlassCard>
       <Button />
     </GlassCard>
   </ScreenLayout>
   ```

5. **Modal implementation**
   ```typescript
   // Always use React Native's Modal component
   <Modal
     visible={showModal}
     transparent
     animationType="slide"
     onRequestClose={handleClose}
   >
     {/* Modal content */}
   </Modal>
   
   // Ensure modals fit within viewport
   modalContent: {
     maxHeight: '90%',
     // Platform-specific constraints
   }
   ```

### ❌ Prohibited Patterns (iOS Compatibility)

**NEVER use these patterns without proper Platform checks:**
```typescript
// ❌ BAD - Will crash on iOS
document.getElementById('myId')
window.localStorage.setItem('key', 'value')
element.style.display = 'none'

// ✅ GOOD - Platform safe
if (Platform.OS === 'web') {
  // Web-only code here
}
```

**NEVER use these libraries/features:**
- Web-only npm packages
- CSS modules or styled-components
- Direct DOM manipulation
- Browser-specific APIs (localStorage, sessionStorage, etc.)
- Web workers
- Service workers

### Future Considerations

1. **Backend Integration Points**
   - All state actions ready for API calls
   - Data models match typical backend structures
   - Authentication hooks in place

2. **Scalability**
   - Component lazy loading ready
   - Code splitting structure
   - Performance optimizations

3. **Design System Updates**
   - All visuals in theme.ts
   - Easy to swap entire design system
   - No hardcoded styles in components

4. **App Store Deployment**
   - iOS app signing and certificates
   - Apple Developer Program membership
   - App Store review guidelines compliance
   - iOS-specific permissions handling

## Quick Reference

### Key Files
- `app/state/appStore.ts` - All app state
- `app/themes/theme.ts` - All design tokens
- `app/navigation/appNavigator.tsx` - Navigation structure
- `a.md` - Architecture principles

### Common Patterns
- Glass morphism: `<GlassCard variant="light" intensity={90}>`
- Gradients: `gradient={theme.gradient.vibrant}`
- Animations: `Animated.spring()` with `useNativeDriver: true`
- State updates: `useAppStore((state) => state.action)`

### Development Commands
```bash
npm start          # Start Expo
npm run web        # Start web version
npm run build:web  # Build for production
```

### Important Architecture Decisions

1. **React Hooks Rules**: Always extract components when using hooks inside mapped functions to avoid "Rendered more hooks than during the previous render" errors
   ```typescript
   // Bad: Hooks inside map
   items.map(item => {
     const [state] = useState() // ERROR!
   })
   
   // Good: Extract component
   const ItemComponent = ({ item }) => {
     const [state] = useState() // OK!
   }
   items.map(item => <ItemComponent item={item} />)
   ```

2. **Modal Architecture**: All modals use React Native's built-in Modal component for consistency and proper viewport handling

3. **State Updates**: Avoid race conditions by updating all related state atomically in Zustand

4. **Styling Approach**: Custom theme system with design tokens (not using Tailwind/NativeWind despite being in dependencies)

---

This documentation reflects the current state of the Coca App Unity project. The architecture is designed for flexibility, scalability, and easy maintenance as the project evolves.