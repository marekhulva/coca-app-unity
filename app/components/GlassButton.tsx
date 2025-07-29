import React, { useRef } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  TouchableOpacityProps,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '../themes/theme'

interface GlassButtonProps extends TouchableOpacityProps {
  title: string
  gradient?: string[]
  variant?: 'solid' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  gradient = theme.gradient.vibrant,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  icon,
  style,
  onPress,
  disabled,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

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

  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 16, fontSize: 14 },
    md: { height: 48, paddingHorizontal: 24, fontSize: 16 },
    lg: { height: 56, paddingHorizontal: 32, fontSize: 18 },
  }

  const currentSize = sizeStyles[size]

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        {...props}
      >
        {variant === 'solid' ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.button,
              { height: currentSize.height },
              disabled && styles.disabled,
            ]}
          >
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text style={[styles.text, { fontSize: currentSize.fontSize }]}>
                {title}
              </Text>
            </View>
          </LinearGradient>
        ) : variant === 'glass' ? (
          <View
            style={[
              styles.button,
              styles.glassButton,
              { height: currentSize.height },
              disabled && styles.disabled,
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text style={[styles.text, { fontSize: currentSize.fontSize }]}>
                {title}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.button,
              styles.outlineButton,
              { height: currentSize.height },
              disabled && styles.disabled,
            ]}
          >
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.outlineGradient}
            />
            <View style={styles.outlineInner}>
              <View style={styles.content}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <Text
                  style={[
                    styles.text,
                    styles.outlineText,
                    { fontSize: currentSize.fontSize },
                  ]}
                >
                  {title}
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  
  button: {
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  outlineButton: {
    padding: 2,
  },
  
  outlineGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.full,
  },
  
  outlineInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.radius.full - 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  
  icon: {
    marginRight: theme.spacing.sm,
  },
  
  text: {
    color: 'white',
    fontWeight: '700',
  },
  
  outlineText: {
    color: '#8338EC',
  },
  
  disabled: {
    opacity: 0.5,
  },
})