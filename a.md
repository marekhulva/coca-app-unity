# 📐 Coca App Frontend Architecture Manifesto

This document defines the official development and modification rules for the Coca App frontend. Any AI assistant, developer, or contributor must **read and follow this guide before making any changes** to the app.

---

## 🔧 Core Tech Stack
- **Framework**: React Native (with Expo)
- **Language**: TypeScript
- **Styling**: Custom Theme System (centralized design tokens)
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Theming**: Centralized theme tokens (colors, spacing, radius, gradients, shadows)
- **Architecture Pattern**: Atomic Design
- **Target Platforms**: iOS (AppStore), Android, and Web
- **Primary Target**: iOS/iPhone for AppStore deployment

---

## 📁 Folder Structure
```
/app
  /components       # Atomic UI elements (Button, TextField, etc.)
  /screens          # Screen-level UI (e.g., HomeScreen, ProfileScreen)
  /layouts          # Shared layout containers
  /hooks            # Custom reusable hooks
  /state            # Zustand stores or context files
  /utils            # Utility functions/helpers
  /constants        # Static config, app text, enums, etc.
  /themes           # Theme tokens and design system
  /navigation       # Stack and tab navigators
/assets             # Images, fonts, etc.
/index.tsx          # App entry point
```

---

## ⚙️ Architecture Principles

### 1. Modularity
Each component, screen, layout, and utility must be completely **self-contained**. Never rely on global state or unrelated components.

### 2. Visual Isolation
UI components should **never contain app logic or API calls**. Logic lives in hooks or stores.

### 3. Atomic Design
Follow this hierarchy:
- **Atoms**: Buttons, TextFields, Icons
- **Molecules**: Form groups, Card headers
- **Organisms**: Full sections of UI like `CheckInPanel`

### 4. Single Responsibility Principle
Each file or component must do one job only. Don't mix concerns.

### 5. No Tight Coupling
Components **must not be interdependent** in ways that cause other parts of the app to break. Use `props`, not hardcoded imports.

### 6. Global Theming
All visual styles must be defined in `/themes`. Use `theme.color.primary`, `theme.spacing.lg`, etc. Never hardcode values.

### 7. Mock-First Data Strategy
Until backend is added, all screens must use dummy data defined in `/constants` or mock hooks.

### 8. Strict Naming Conventions
- **Files/Folders**: `camelCase`
- **Components/Classes**: `PascalCase`
- **Constants**: `UPPER_CASE`

### 9. Reusability & Extensibility
Every component or feature must be designed to be reused or extended. No single-use code.

### 10. Safe Refactorability
When making changes:
- Do not mutate global files.
- Create new components and swap gradually.
- Comment deprecated code clearly.

---

## 📢 AI + Developer Instructions
**Before making any changes, ALWAYS:**
1. Read this document.
2. Follow folder structure.
3. Use modular, clean design.
4. Assume this frontend will be connected to a backend in the future.
5. Ask if unsure.

---

## ✅ Example Workflow

- Create new screen: `/app/screens/focusBlockScreen.tsx`
- Pull components from: `/app/components` or build new ones
- Add styles from: `/themes/theme.ts`
- Hold logic in: `/hooks/useFocusBlock.ts`
- Store state in: `/state/focusBlockStore.ts`
- Add nav route in: `/navigation/appNavigator.tsx`

---

## 🧠 Design Philosophy
This app is built to scale visually, technically, and structurally. It is:
- Easy to navigate
- Easy to theme
- Easy to test
- Easy to hand off
- Easy to grow to 500k+ users

---

## 🎨 Platform Component Guidelines

### 🚨 iOS/AppStore Deployment Requirements
**CRITICAL**: This app will be deployed to the Apple App Store. Every component and feature MUST be iOS-compatible.

Before implementing ANY feature, ask yourself:
1. Will this work on a physical iPhone?
2. Does this use any web-only APIs?
3. Have I properly wrapped platform-specific code?

### Modal Implementation
- **Always use React Native's built-in Modal component** for overlays and popups
- Custom modal implementations should be avoided for consistency and platform compatibility
- Modal positioning and constraints are handled via StyleSheet with platform-specific rules
- Use `maxHeight: '90%'` constraint to ensure modals fit within viewport on all devices

### Platform-Specific Code
**MANDATORY RULES**:
- **NEVER** use web-only APIs (document, window, localStorage) without Platform checks
- **ALWAYS** wrap web-specific code in `if (Platform.OS === 'web')` 
- **ALWAYS** provide iOS fallbacks for web-specific features
- Use `Platform.select()` or `Platform.OS` checks for platform differences
- Always provide `useNativeDriver: Platform.OS !== 'web'` for animations
- Handle web-specific styling (e.g., `boxShadow` vs native shadow properties)

### Glass Morphism Design System
- Primary design pattern uses glass morphism effects
- GlassCard component provides consistent glass backgrounds
- Blur effects are platform-specific (expo-blur for native, CSS for web)
- Consistent use of semi-transparent backgrounds with blur

### iOS Compatibility Checklist
Before committing ANY code, verify:
- [ ] No direct DOM manipulation without Platform checks
- [ ] No web-only dependencies in shared code
- [ ] Animations use `useNativeDriver: Platform.OS !== 'web'`
- [ ] Styles use Platform.select() for platform differences
- [ ] All external libraries support React Native iOS
- [ ] No hardcoded web-specific units (vh, vw, etc.)
- [ ] Touch interactions work with TouchableOpacity/Pressable

---

✅ **This is the law of the Coca App frontend. Treat it like the constitution.**