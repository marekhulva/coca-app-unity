import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { theme } from '../themes/theme'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  label?: string
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = theme.color.primary,
  backgroundColor = theme.color.border.light,
  showPercentage = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            stroke={backgroundColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      
      <View style={styles.textContainer}>
        {showPercentage && (
          <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        )}
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  svg: {
    position: 'absolute',
  },
  
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  percentage: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
  },
  
  label: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.xs,
  },
})