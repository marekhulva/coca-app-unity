import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

interface AnimatedGradientProps {
  colors: string[]
  style?: any
  animate?: boolean
  speed?: number
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  style,
  animate = true,
  speed = 10000,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (animate) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: speed,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: speed,
            useNativeDriver: true,
          }),
        ])
      )
      animation.start()
      return () => animation.stop()
    }
  }, [animate, speed])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  })

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 2, height / 2],
  })

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        animate && {
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  
  gradient: {
    width: width * 2,
    height: height * 2,
  },
})