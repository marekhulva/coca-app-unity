import React from 'react'
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
} from 'react-native'
import { theme } from '../themes/theme'

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled'
  padding?: 'sm' | 'md' | 'lg'
  onPress?: () => void
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
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

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.background.primary,
  },
  
  elevated: {
    ...theme.shadow.md,
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: theme.color.border.default,
  },
  
  filled: {
    backgroundColor: theme.color.background.secondary,
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