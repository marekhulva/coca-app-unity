import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AnimatedGradient } from '../components/AnimatedGradient'
import { MatrixRain } from '../components/MatrixRain'
import { theme } from '../themes/theme'

interface ScreenLayoutProps extends ViewProps {
  children: React.ReactNode
  gradient?: string[]
  safeArea?: boolean
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
  matrixRain?: boolean
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  gradient = theme.gradient.vibrant,
  safeArea = true,
  edges = ['top'],
  matrixRain = false, // Disable Matrix rain by default
  style,
  ...props
}) => {
  const Container = safeArea ? SafeAreaView : View

  return (
    <View style={styles.container}>
      {matrixRain ? (
        <MatrixRain style={styles.matrixRain} />
      ) : (
        <AnimatedGradient
          colors={gradient}
          style={styles.gradient}
          animate={false}
        />
      )}
      <Container style={[styles.content, style]} edges={edges} {...props}>
        {children}
      </Container>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.primary,
  },
  
  gradient: {
    opacity: 0.15,
    height: 300,
  },
  
  matrixRain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  
  content: {
    flex: 1,
  },
})