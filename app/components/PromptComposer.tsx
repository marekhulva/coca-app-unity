import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native'
import { GlassCard } from './GlassCard'
import { GlassButton } from './GlassButton'
import { theme } from '../themes/theme'
import { SOCIAL_PROMPTS, FREE_FORM_PROMPT } from '../constants/prompts'
import { useAppStore } from '../state/appStore'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth - (theme.spacing.lg * 2)

export const PromptComposer: React.FC = () => {
  const { publishPost } = useAppStore()
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [inputText, setInputText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const inputRef = useRef<TextInput>(null)
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Show 3 random prompts + free form
  const [displayPrompts] = useState(() => 
    SOCIAL_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3)
  )
  
  const prompts = [...displayPrompts, FREE_FORM_PROMPT]
  const currentPrompt = prompts[currentPromptIndex]

  const getPlaceholder = () => {
    if (currentPrompt.id === 'free-form') {
      return "Share what's on your mind..."
    }
    return "Share your thoughts here..."
  }

  const handlePost = () => {
    if (inputText.trim()) {
      const postContent = currentPrompt.id === 'free-form' 
        ? inputText 
        : `${currentPrompt.emoji} ${currentPrompt.fullText}\n\n${inputText}`
      
      publishPost(postContent)
      setInputText('')
      inputRef.current?.blur()
    }
  }

  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / CARD_WIDTH)
    setCurrentPromptIndex(index)
  }

  const borderColor = isFocused ? theme.color.primary : 'transparent'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <GlassCard
          variant="light"
          intensity={85}
          padding="lg"
          style={[styles.card, { borderColor }]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            style={styles.promptScroll}
            contentContainerStyle={styles.promptScrollContent}
          >
            {prompts.map((prompt, index) => (
              <View key={prompt.id} style={styles.promptContainer}>
                <View style={styles.promptHeader}>
                  <Text style={styles.promptEmoji}>{prompt.emoji}</Text>
                  <Text style={styles.promptText}>{prompt.fullText}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.dotsContainer}>
            {prompts.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPromptIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={getPlaceholder()}
              placeholderTextColor={theme.color.text.placeholder}
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline
              maxLength={280}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.charCount}>
              {inputText.length}/280
            </Text>
            <GlassButton
              title="Post"
              gradient={theme.gradient.vibrant}
              variant="solid"
              size="sm"
              onPress={handlePost}
              disabled={!inputText.trim()}
              style={styles.postButton}
            />
          </View>
        </GlassCard>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },

  promptScroll: {
    marginHorizontal: -theme.spacing.lg,
    height: 80,
  },

  promptScrollContent: {
    paddingHorizontal: 0,
  },

  promptContainer: {
    width: CARD_WIDTH,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },

  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  promptEmoji: {
    fontSize: theme.font.size.xxl,
    marginRight: theme.spacing.sm,
  },

  promptText: {
    flex: 1,
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.border.light,
  },

  activeDot: {
    backgroundColor: theme.color.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  inputContainer: {
    backgroundColor: theme.color.background.secondary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    minHeight: 80,
    marginBottom: theme.spacing.sm,
  },

  input: {
    fontSize: theme.font.size.md,
    lineHeight: theme.font.size.md * 1.5,
    color: theme.color.text.primary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  charCount: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
  },

  postButton: {
    paddingHorizontal: theme.spacing.xl,
  },
})