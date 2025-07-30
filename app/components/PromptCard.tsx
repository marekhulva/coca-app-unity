import React, { useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from './GlassCard'
import { theme } from '../themes/theme'
import { Prompt } from '../constants/prompts'

interface PromptCardProps {
  prompt: Prompt
  onPress: () => void
  isSelected?: boolean
  style?: any
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  onPress, 
  isSelected = false,
  style 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-2deg'],
  })

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotation },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <GlassCard
          variant={isSelected ? 'dark' : 'light'}
          intensity={isSelected ? 95 : 90}
          padding="lg"
          style={styles.card}
        >
          {isSelected && (
            <LinearGradient
              colors={theme.gradient.vibrant}
              style={styles.selectedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          
          <View style={styles.content}>
            <Text style={styles.emoji}>{prompt.emoji}</Text>
            <Text style={[
              styles.title,
              isSelected && styles.selectedTitle
            ]}>
              {prompt.title}
            </Text>
            <Text style={[
              styles.subtitle,
              isSelected && styles.selectedSubtitle
            ]}>
              Tap to share
            </Text>
          </View>
          
          {isSelected && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Selected</Text>
            </View>
          )}
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 160,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },

  selectedGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emoji: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },

  title: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },

  selectedTitle: {
    color: theme.color.primary,
  },

  subtitle: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.tertiary,
    textAlign: 'center',
  },

  selectedSubtitle: {
    color: theme.color.primary,
    fontWeight: theme.font.weight.medium,
  },

  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.color.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.inverse,
  },
})