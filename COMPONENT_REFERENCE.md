# Component Reference Guide

Complete reference for all reusable components in the Coca App Unity project.

## Core Components

### GlassCard

Glass morphism container component with blur effects.

```typescript
interface GlassCardProps {
  children: React.ReactNode
  variant?: 'light' | 'dark'
  intensity?: number  // 0-100 blur intensity
  padding?: 'none' | 'sm' | 'md' | 'lg'
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}
```

**Usage:**
```tsx
<GlassCard variant="light" intensity={90} padding="lg">
  <Text>Content with glass effect</Text>
</GlassCard>
```

**Platform Notes:**
- Web: Uses CSS backdrop-filter
- Native: Uses expo-blur BlurView

---

### GlassButton

Beautiful gradient button with three variants.

```typescript
interface GlassButtonProps extends TouchableOpacityProps {
  title: string
  gradient?: string[]
  variant?: 'solid' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: React.ReactNode
}
```

**Usage:**
```tsx
// Solid gradient button
<GlassButton
  title="Continue"
  variant="solid"
  gradient={theme.gradient.vibrant}
  size="lg"
  fullWidth
  onPress={handlePress}
/>

// Glass variant
<GlassButton
  title="Cancel"
  variant="glass"
  size="md"
/>

// Outline with gradient border
<GlassButton
  title="Learn More"
  variant="outline"
  gradient={theme.gradient.sunset}
/>
```

**Size Specs:**
- `sm`: height 36px, fontSize 14px
- `md`: height 48px, fontSize 16px
- `lg`: height 56px, fontSize 18px

---

### AnimatedGradient

Animated gradient background with customizable movement.

```typescript
interface AnimatedGradientProps {
  colors: string[]
  style?: any
  animate?: boolean
  speed?: number  // milliseconds for full cycle
}
```

**Usage:**
```tsx
// Static gradient
<AnimatedGradient
  colors={theme.gradient.cosmic}
  animate={false}
  style={styles.background}
/>

// Animated gradient
<AnimatedGradient
  colors={theme.gradient.vibrant}
  animate={true}
  speed={10000}
/>
```

---

### ProgressRing

Circular progress indicator with gradient support.

```typescript
interface ProgressRingProps {
  progress: number  // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  animated?: boolean
}
```

**Usage:**
```tsx
<ProgressRing
  progress={75}
  size={100}
  strokeWidth={10}
  color="#FF006E"
  backgroundColor="rgba(255, 255, 255, 0.3)"
  showPercentage
  animated
/>
```

---

### TextField

Glass morphism text input with floating label.

```typescript
interface TextFieldProps extends TextInputProps {
  label: string
  error?: string
  variant?: 'default' | 'glass'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

**Usage:**
```tsx
<TextField
  label="Goal title"
  placeholder="e.g., Run a marathon"
  value={goalTitle}
  onChangeText={setGoalTitle}
  variant="glass"
  error={errors.goalTitle}
/>
```

---

### Button (Legacy)

Standard button component (being replaced by GlassButton).

```typescript
interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
}
```

---

### DatePicker

Platform-specific date picker with glass styling.

```typescript
interface DatePickerProps {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
  mode?: 'date' | 'time' | 'datetime'
}
```

**Usage:**
```tsx
<DatePicker
  label="Target deadline"
  value={deadline}
  onChange={setDeadline}
  minimumDate={new Date()}
  maximumDate={maxDate}
/>
```

---

### TabBar

Horizontal tab component for switching views.

```typescript
interface TabBarProps {
  tabs: Array<{ id: string; label: string }>
  activeTab: string
  onTabPress: (tabId: string) => void
  variant?: 'default' | 'pills'
}
```

**Usage:**
```tsx
<TabBar
  tabs={[
    { id: 'personal', label: 'Personal' },
    { id: 'group', label: 'Group' }
  ]}
  activeTab={currentTab}
  onTabPress={setCurrentTab}
  variant="pills"
/>
```

---

### Modal

Overlay modal with glass effect background.

```typescript
interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
  showCloseButton?: boolean
}
```

**Usage:**
```tsx
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Share Your Progress"
  size="md"
>
  <ModalContent />
</Modal>
```

---

### Card

Basic card container (legacy, prefer GlassCard).

```typescript
interface CardProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  style?: StyleProp<ViewStyle>
}
```

---

### Checkbox

Custom checkbox with animation.

```typescript
interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}
```

**Usage:**
```tsx
<Checkbox
  checked={isCompleted}
  onChange={setIsCompleted}
  label="Mark as complete"
  color={theme.color.primary}
/>
```

---

## Layout Components

### ScreenLayout

Consistent screen wrapper with gradient background.

```typescript
interface ScreenLayoutProps extends ViewProps {
  children: React.ReactNode
  gradient?: string[]
  safeArea?: boolean
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}
```

**Usage:**
```tsx
<ScreenLayout gradient={theme.gradient.cosmic}>
  <ScrollView>
    {/* Screen content */}
  </ScrollView>
</ScreenLayout>
```

**Features:**
- Automatic safe area handling
- Gradient background
- Consistent padding

---

## Utility Components

### BlurView.web

Web-specific blur implementation.

```typescript
interface BlurViewProps {
  intensity: number  // 0-100
  tint?: 'light' | 'dark' | 'default'
  style?: any
  children?: React.ReactNode
}
```

**Note:** Automatically used by GlassCard on web platform.

---

### SafeArea

Platform-agnostic safe area wrapper.

```typescript
interface SafeAreaProps {
  children: React.ReactNode
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
  style?: StyleProp<ViewStyle>
}
```

---

## Animation Patterns

### Common Animation Values

```typescript
// Fade in animation
const fadeAnim = useRef(new Animated.Value(0)).current

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 600,
    useNativeDriver: true,
  }).start()
}, [])

// Spring animation
const scaleAnim = useRef(new Animated.Value(0.9)).current

Animated.spring(scaleAnim, {
  toValue: 1,
  friction: 5,
  tension: 40,
  useNativeDriver: true,
}).start()
```

### Touch Feedback

```typescript
const handlePressIn = () => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start()
}

const handlePressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  }).start()
}
```

---

## Theme Integration

All components use the centralized theme:

```typescript
import { theme } from '../themes/theme'

// Using theme colors
color: theme.color.primary
backgroundColor: theme.color.background.secondary

// Using gradients
gradient={theme.gradient.vibrant}

// Using spacing
padding: theme.spacing.md
marginBottom: theme.spacing.lg

// Using typography
fontSize: theme.font.size.lg
fontWeight: theme.font.weight.semibold

// Using radius
borderRadius: theme.radius.lg
```

---

## Best Practices

1. **Always use theme tokens** - Never hardcode colors or spacing
2. **Prefer GlassCard over Card** - For consistency with design system
3. **Use GlassButton for CTAs** - More visually appealing than Button
4. **Animate with useNativeDriver** - Better performance
5. **Test on both platforms** - Check blur effects on web vs native

---

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| GlassCard | ✅ Active | Primary container component |
| GlassButton | ✅ Active | Primary button component |
| AnimatedGradient | ✅ Active | Background effects |
| ProgressRing | ✅ Active | Progress visualization |
| TextField | ✅ Active | Form inputs |
| Button | ⚠️ Legacy | Use GlassButton instead |
| DatePicker | ✅ Active | Date selection |
| TabBar | ✅ Active | Tab navigation |
| Modal | ✅ Active | Overlays |
| Card | ⚠️ Legacy | Use GlassCard instead |
| Checkbox | ✅ Active | Selection inputs |
| ScreenLayout | ✅ Active | Screen wrapper |

---

This reference is current as of the latest commit. When adding new components, update this document with usage examples and integration notes.