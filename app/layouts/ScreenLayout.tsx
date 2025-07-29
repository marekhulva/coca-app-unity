import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedGradient } from '../components/AnimatedGradient'
import { theme } from '../themes/theme'

interface ScreenLayoutProps extends ViewProps {
  children: React.ReactNode
  gradient?: string[]
  safeArea?: boolean
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  gradient = theme.gradient.vibrant,
  safeArea = true,
  edges = ['top'],
  style,
  ...props
}) => {
  const Container = safeArea ? SafeAreaView : View

  return (
    <View style={styles.container}>
      <AnimatedGradient
        colors={gradient}
        style={styles.gradient}
        animate={false}
      />
      <Container style={[styles.content, style]} edges={edges} {...props}>
        {children}
      </Container>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  
  gradient: {
    opacity: 0.15,
    height: 300,
  },
  
  content: {
    flex: 1,
  },
})