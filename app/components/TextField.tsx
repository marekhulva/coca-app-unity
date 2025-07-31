import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native'
import { theme } from '../themes/theme'

interface TextFieldProps extends TextInputProps {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'glass'
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  variant = 'glass',
  icon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const animatedScale = React.useRef(new Animated.Value(1)).current
  
  const handleFocus = () => {
    setIsFocused(true)
    Animated.spring(animatedScale, {
      toValue: 1.02,
      friction: 5,
      useNativeDriver: true,
    }).start()
  }
  
  const handleBlur = () => {
    setIsFocused(false)
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputContainer,
        styles[variant],
        isFocused && styles.focused,
        error && styles.error,
        { transform: [{ scale: animatedScale }] },
      ]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={theme.color.text.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconRight}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {(error || hint) && (
        <Text style={[styles.hint, error && styles.errorText]}>
          {error || hint}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  
  label: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border.default,
    backgroundColor: theme.color.background.primary,
    minHeight: 48,
  },
  
  default: {
    backgroundColor: theme.color.background.primary,
  },
  
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    ...Platform.select({
      ios: {
        shadowColor: theme.color.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(255, 0, 110, 0.1)',
      },
    }),
  },
  
  focused: {
    borderColor: theme.color.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.color.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(255, 0, 110, 0.25)',
      },
    }),
  },
  
  error: {
    borderColor: theme.color.error,
  },
  
  input: {
    flex: 1,
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  
  inputWithIcon: {
    paddingLeft: theme.spacing.xs,
  },
  
  inputWithRightIcon: {
    paddingRight: theme.spacing.xs,
  },
  
  iconLeft: {
    paddingLeft: theme.spacing.sm,
  },
  
  iconRight: {
    paddingRight: theme.spacing.sm,
  },
  
  hint: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  
  errorText: {
    color: theme.color.error,
  },
})