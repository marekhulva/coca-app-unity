import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from './GlassCard'
import { theme } from '../themes/theme'
import { Prompt } from '../constants/prompts'
import { useAppStore } from '../state/appStore'

interface QuickComposeProps {
  selectedPrompt: Prompt | null
  onClose: () => void
}

export const QuickCompose: React.FC<QuickComposeProps> = ({ 
  selectedPrompt,
  onClose 
}) => {
  const { publishPost } = useAppStore()
  const [text, setText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const heightAnim = useRef(new Animated.Value(60)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (selectedPrompt) {
      setIsExpanded(true)
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: 120,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        inputRef.current?.focus()
      })
    } else {
      setIsExpanded(false)
      setText('')
    }
  }, [selectedPrompt])

  const handlePost = () => {
    if (text.trim() && selectedPrompt) {
      const postContent = selectedPrompt.id === 'free-form' 
        ? text 
        : `${selectedPrompt.emoji} ${selectedPrompt.fullText}\n\n${text}`
      
      publishPost(postContent)
      setText('')
      onClose()
    }
  }

  const getPlaceholder = () => {
    if (!selectedPrompt) return "Tap a prompt above to start sharing..."
    if (selectedPrompt.id === 'free-form') return "What's on your mind?"
    return "Share your thoughts..."
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <GlassCard
          variant="light"
          intensity={95}
          padding="md"
          style={styles.card}
        >
          {selectedPrompt && (
            <View style={styles.promptHeader}>
              <View style={styles.promptInfo}>
                <Text style={styles.promptEmoji}>{selectedPrompt.emoji}</Text>
                <Text style={styles.promptText}>{selectedPrompt.fullText}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <Animated.View style={{ height: heightAnim }}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={getPlaceholder()}
              placeholderTextColor={theme.color.text.placeholder}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={280}
              editable={!!selectedPrompt}
            />
          </Animated.View>
          
          {isExpanded && (
            <View style={styles.footer}>
              <Text style={styles.charCount}>
                {text.length}/280
              </Text>
              
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => setText(text + ' 🔥')}
                >
                  <Text style={styles.quickActionText}>🔥</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => setText(text + ' 💪')}
                >
                  <Text style={styles.quickActionText}>💪</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => setText(text + ' 🎯')}
                >
                  <Text style={styles.quickActionText}>🎯</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handlePost}
                  disabled={!text.trim()}
                  style={styles.postButton}
                >
                  <LinearGradient
                    colors={text.trim() ? theme.gradient.vibrant : ['#E0E0E0', '#E0E0E0']}
                    style={styles.postGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.postText}>Post</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </GlassCard>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  card: {
    borderRadius: theme.radius.xl,
  },

  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  promptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  promptEmoji: {
    fontSize: theme.font.size.xl,
    marginRight: theme.spacing.sm,
  },

  promptText: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.secondary,
    flex: 1,
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.color.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeIcon: {
    fontSize: theme.font.size.xl,
    color: theme.color.text.tertiary,
    fontWeight: theme.font.weight.light,
  },

  input: {
    fontSize: theme.font.size.md,
    lineHeight: theme.font.size.md * 1.5,
    color: theme.color.text.primary,
    paddingVertical: theme.spacing.sm,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.color.border.light,
  },

  charCount: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.tertiary,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  quickAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.color.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionText: {
    fontSize: theme.font.size.lg,
  },

  postButton: {
    marginLeft: theme.spacing.sm,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },

  postGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },

  postText: {
    color: theme.color.text.inverse,
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.bold,
  },
})