import React from 'react'
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { theme } from '../themes/theme'

let BlurView: any
if (Platform.OS === 'web') {
  BlurView = require('./BlurView.web').BlurView
} else {
  BlurView = require('expo-blur').BlurView
}

interface GlassCardProps extends ViewProps {
  variant?: 'light' | 'dark' | 'blur'
  intensity?: number
  padding?: 'sm' | 'md' | 'lg'
  onPress?: () => void
  children: React.ReactNode
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'light',
  intensity = 80,
  padding = 'md',
  onPress,
  children,
  style,
  ...props
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ]

  const content = (
    <BlurView
      intensity={intensity}
      tint={variant === 'dark' ? 'dark' : 'light'}
      style={cardStyle}
      {...props}
    >
      <View style={styles.overlay} />
      {children}
    </BlurView>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    )
  }

  return content
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadow.glass,
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.xl,
  },
  
  light: {
    backgroundColor: theme.color.glass.light,
  },
  
  dark: {
    backgroundColor: theme.color.glass.dark,
  },
  
  blur: {
    backgroundColor: theme.color.glass.blur,
  },
  
  paddingSm: {
    padding: theme.spacing.sm,
  },
  
  paddingMd: {
    padding: theme.spacing.md,
  },
  
  paddingLg: {
    padding: theme.spacing.lg,
  },
})