import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native'
import { PromptCard } from './PromptCard'
import { theme } from '../themes/theme'
import { SOCIAL_PROMPTS, FREE_FORM_PROMPT, Prompt } from '../constants/prompts'

interface PromptCarouselProps {
  onPromptSelect: (prompt: Prompt) => void
  selectedPromptId: string | null
}

export const PromptCarousel: React.FC<PromptCarouselProps> = ({ 
  onPromptSelect,
  selectedPromptId 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Show 3 random prompts + free form
  const [displayPrompts] = useState(() => 
    [...SOCIAL_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3), FREE_FORM_PROMPT]
  )

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Share your journey</Text>
        <Text style={styles.subtitle}>Choose a prompt or write freely</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayPrompts.map((prompt, index) => (
          <Animated.View
            key={prompt.id}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50 * (index + 1), 0],
                }),
              }],
            }}
          >
            <PromptCard
              prompt={prompt}
              onPress={() => onPromptSelect(prompt)}
              isSelected={selectedPromptId === prompt.id}
              style={[
                styles.promptCard,
                index === 0 && styles.firstCard,
              ]}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  title: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },

  subtitle: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },

  scrollView: {
    marginBottom: theme.spacing.lg,
  },

  scrollContent: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
  },

  promptCard: {
    marginRight: theme.spacing.md,
  },

  firstCard: {
    marginLeft: 0,
  },
})