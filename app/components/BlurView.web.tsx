import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

interface BlurViewProps extends ViewProps {
  intensity?: number
  tint?: 'light' | 'dark' | 'default'
  children?: React.ReactNode
}

export const BlurView: React.FC<BlurViewProps> = ({ 
  intensity = 80, 
  tint = 'light',
  style,
  children,
  ...props 
}) => {
  const blurAmount = Math.round((intensity / 100) * 20)
  const backgroundColor = tint === 'dark' 
    ? `rgba(0, 0, 0, ${intensity / 200})`
    : `rgba(255, 255, 255, ${intensity / 150})`
  
  return (
    <View
      {...props}
      style={[
        styles.container,
        {
          backgroundColor,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
        } as any,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
})