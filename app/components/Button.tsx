import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { theme } from '../themes/theme'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ]

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ]

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
  },
  
  primary: {
    backgroundColor: theme.color.primary,
  },
  
  secondary: {
    backgroundColor: theme.color.secondary,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.color.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  sm: {
    height: 32,
    paddingHorizontal: theme.spacing.sm,
  },
  
  md: {
    height: 44,
    paddingHorizontal: theme.spacing.md,
  },
  
  lg: {
    height: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  text: {
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.inverse,
  },
  
  primaryText: {
    color: theme.color.text.inverse,
  },
  
  secondaryText: {
    color: theme.color.text.inverse,
  },
  
  outlineText: {
    color: theme.color.primary,
  },
  
  ghostText: {
    color: theme.color.primary,
  },
  
  smText: {
    fontSize: theme.font.size.sm,
  },
  
  mdText: {
    fontSize: theme.font.size.md,
  },
  
  lgText: {
    fontSize: theme.font.size.lg,
  },
  
  disabledText: {
    color: theme.color.text.tertiary,
  },
})