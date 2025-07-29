import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import { theme } from '../themes/theme'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  variant?: 'default' | 'circle'
  size?: 'sm' | 'md' | 'lg'
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  variant = 'default',
  size = 'md',
}) => {
  const scale = React.useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 0.9 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [checked])

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const boxSize = {
    sm: 20,
    md: 24,
    lg: 28,
  }[size]

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.checkbox,
          styles[variant],
          {
            width: boxSize,
            height: boxSize,
            transform: [{ scale }],
          },
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <View style={styles.checkmark}>
            <Text style={[styles.checkmarkText, { fontSize: boxSize * 0.6 }]}>
              ✓
            </Text>
          </View>
        )}
      </Animated.View>
      
      {label && (
        <Text style={[
          styles.label,
          styles[`${size}Label`],
          disabled && styles.disabledText,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  checkbox: {
    borderWidth: 2,
    borderColor: theme.color.border.default,
    backgroundColor: theme.color.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  default: {
    borderRadius: theme.radius.sm,
  },
  
  circle: {
    borderRadius: theme.radius.full,
  },
  
  checked: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkmarkText: {
    color: theme.color.text.inverse,
    fontWeight: theme.font.weight.bold,
  },
  
  label: {
    marginLeft: theme.spacing.sm,
    color: theme.color.text.primary,
  },
  
  smLabel: {
    fontSize: theme.font.size.sm,
  },
  
  mdLabel: {
    fontSize: theme.font.size.md,
  },
  
  lgLabel: {
    fontSize: theme.font.size.lg,
  },
  
  disabledText: {
    color: theme.color.text.tertiary,
  },
})