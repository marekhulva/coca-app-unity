import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
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
  variant = 'default',
  icon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        styles[variant],
        isFocused && styles.focused,
        error && styles.error,
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      </View>
      
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
    backgroundColor: theme.color.glass.light,
    borderColor: theme.color.border.glass,
  },
  
  focused: {
    borderColor: theme.color.primary,
    borderWidth: 2,
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