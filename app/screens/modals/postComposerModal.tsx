import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GlassCard } from '../../components/GlassCard'
import { GlassButton } from '../../components/GlassButton'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import { SOCIAL_PROMPTS, FREE_FORM_PROMPT } from '../../constants/prompts'

export const PostComposerModal: React.FC = () => {
  const {
    showPostComposer,
    selectedPromptId,
    closePostComposer,
    publishPost,
    user,
  } = useAppStore()

  const [content, setContent] = useState('')
  const slideAnim = useRef(new Animated.Value(300)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const selectedPrompt = selectedPromptId
    ? [...SOCIAL_PROMPTS, FREE_FORM_PROMPT].find(p => p.id === selectedPromptId)
    : null

  useEffect(() => {
    if (showPostComposer) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [showPostComposer])

  const handlePublish = () => {
    if (content.trim()) {
      publishPost(content.trim())
      setContent('')
    }
  }

  return (
    <Modal
      visible={showPostComposer}
      transparent
      animationType="none"
      onRequestClose={closePostComposer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: fadeAnim },
          ]}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <GlassCard variant="light" intensity={95} padding="lg" style={styles.card}>
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Text style={styles.avatar}>{user.avatar}</Text>
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
                <GlassButton
                  title="Cancel"
                  variant="glass"
                  size="sm"
                  onPress={closePostComposer}
                />
              </View>

              {selectedPrompt && (
                <View style={styles.promptContainer}>
                  <Text style={styles.promptEmoji}>{selectedPrompt.emoji}</Text>
                  <Text style={styles.promptText}>{selectedPrompt.fullText}</Text>
                </View>
              )}

              <ScrollView style={styles.inputContainer} showsVerticalScrollIndicator={false}>
                <TextInput
                  style={styles.input}
                  placeholder={selectedPrompt ? "Share your thoughts..." : "What's on your mind?"}
                  placeholderTextColor={theme.color.text.placeholder}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  autoFocus
                  maxLength={500}
                />
              </ScrollView>

              <View style={styles.footer}>
                <Text style={styles.charCount}>
                  {content.length}/500
                </Text>
                <GlassButton
                  title="Post"
                  gradient={theme.gradient.vibrant}
                  variant="solid"
                  size="md"
                  onPress={handlePublish}
                  disabled={!content.trim()}
                />
              </View>
            </GlassCard>
          </SafeAreaView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  safeArea: {
    backgroundColor: 'transparent',
  },

  card: {
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 400,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    fontSize: theme.font.size.xl,
    marginRight: theme.spacing.sm,
  },

  userName: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
  },

  promptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.color.glass.light,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
  },

  promptEmoji: {
    fontSize: theme.font.size.xl,
    marginRight: theme.spacing.sm,
  },

  promptText: {
    flex: 1,
    fontSize: theme.font.size.md,
    color: theme.color.text.secondary,
    fontWeight: theme.font.weight.medium,
  },

  inputContainer: {
    flex: 1,
    minHeight: 150,
    maxHeight: 250,
  },

  input: {
    fontSize: theme.font.size.lg,
    lineHeight: theme.font.size.lg * 1.5,
    color: theme.color.text.primary,
    paddingVertical: theme.spacing.md,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.color.border.light,
  },

  charCount: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
  },
})