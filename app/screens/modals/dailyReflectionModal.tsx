import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassButton } from '../../components/GlassButton'
import { GlassCard } from '../../components/GlassCard'
import { TextField } from '../../components/TextField'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'

const { width } = Dimensions.get('window')

const BLOCKER_EMOJIS = [
  { emoji: '📱', label: 'Phone' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤯', label: 'Forgot' },
  { emoji: '⏰', label: 'Too busy' },
  { emoji: '😔', label: 'Not motivated' },
  { emoji: '🤒', label: 'Sick' },
]

export const DailyReflectionModal: React.FC = () => {
  const {
    showDailyReflection,
    reflectionStep,
    currentReflectionActionIndex,
    userActions,
    checkedActions,
    dailyReflection,
    blockerEmojis,
    closeDailyReflection,
    nextReflectionAction,
    setActionBlocker,
    updateDailyReflection,
    saveDailyReflection,
  } = useAppStore()

  const [actionResponse, setActionResponse] = useState<boolean | null>(null)
  const [blockerReason, setBlockerReason] = useState('')
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [todoInput, setTodoInput] = useState('')

  const slideAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const missedActions = userActions.filter(action => !checkedActions[action.id])
  const currentAction = missedActions[currentReflectionActionIndex]
  const totalSteps = missedActions.length + 1 // +1 for journal screen

  useEffect(() => {
    if (showDailyReflection) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start()
    }
  }, [showDailyReflection, currentReflectionActionIndex, reflectionStep])

  const handleActionResponse = (response: boolean) => {
    setActionResponse(response)
    if (response) {
      // Mark action as completed and move to next
      useAppStore.setState((state) => ({
        checkedActions: {
          ...state.checkedActions,
          [currentAction.id]: true,
        },
      }))
      setTimeout(() => {
        resetAndNext()
      }, 300)
    }
  }

  const handleBlockerSubmit = () => {
    if (blockerReason || selectedEmojis.length > 0) {
      setActionBlocker(currentAction.id, blockerReason, selectedEmojis)
      resetAndNext()
    }
  }

  const resetAndNext = () => {
    setActionResponse(null)
    setBlockerReason('')
    setSelectedEmojis([])
    nextReflectionAction()
  }

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    )
  }

  const addTodo = () => {
    if (todoInput.trim()) {
      updateDailyReflection('tomorrowTodos', [
        ...dailyReflection.tomorrowTodos,
        todoInput.trim(),
      ])
      setTodoInput('')
    }
  }

  const removeTodo = (index: number) => {
    updateDailyReflection(
      'tomorrowTodos',
      dailyReflection.tomorrowTodos.filter((_, i) => i !== index)
    )
  }

  const renderProgressIndicator = () => {
    const currentStep = reflectionStep === 'checkin' ? currentReflectionActionIndex + 1 : totalSteps
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressDots}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index < currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          {currentStep} of {totalSteps}
        </Text>
      </View>
    )
  }

  const renderCheckInScreen = () => {
    if (!currentAction) return null

    return (
      <Animated.View
        style={[
          styles.screenContent,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Daily Check-In</Text>
          <Text style={styles.question}>
            Did you finish {currentAction.name}?
          </Text>
        </View>

        {actionResponse === null && (
          <View style={styles.responseButtons}>
            <GlassButton
              title="Yes"
              variant="solid"
              gradient={theme.gradient.success}
              size="lg"
              onPress={() => handleActionResponse(true)}
              style={styles.responseButton}
            />
            <GlassButton
              title="No"
              variant="outline"
              size="lg"
              onPress={() => handleActionResponse(false)}
              style={styles.responseButton}
            />
          </View>
        )}

        {actionResponse === false && (
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <Text style={styles.blockerPrompt}>What got in the way?</Text>
            
            <View style={styles.emojiContainer}>
              {BLOCKER_EMOJIS.map(({ emoji, label }) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiChip,
                    selectedEmojis.includes(emoji) && styles.emojiChipActive,
                  ]}
                  onPress={() => toggleEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                  <Text style={styles.emojiLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextField
              placeholder="Tell us more (optional)"
              value={blockerReason}
              onChangeText={setBlockerReason}
              multiline
              numberOfLines={3}
              variant="glass"
              style={styles.blockerInput}
            />

            <GlassButton
              title="Continue"
              variant="solid"
              gradient={theme.gradient.vibrant}
              size="lg"
              fullWidth
              onPress={handleBlockerSubmit}
              disabled={!blockerReason && selectedEmojis.length === 0}
              style={styles.continueButton}
            />
          </Animated.View>
        )}
      </Animated.View>
    )
  }

  const renderJournalScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.journalScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.journalContent}
        >
          <Animated.View
            style={[
              styles.journalContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.journalTitle}>Daily Reflection</Text>

            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>What's your biggest win of the day?</Text>
              <TextField
                placeholder="I'm proud that I..."
                value={dailyReflection.biggestWin}
                onChangeText={(text) => updateDailyReflection('biggestWin', text)}
                multiline
                numberOfLines={2}
                variant="glass"
              />
            </View>

            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>What's your biggest insight of the day?</Text>
              <TextField
                placeholder="I learned that..."
                value={dailyReflection.biggestInsight}
                onChangeText={(text) => updateDailyReflection('biggestInsight', text)}
                multiline
                numberOfLines={2}
                variant="glass"
              />
            </View>

            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>What are you grateful for today?</Text>
              <TextField
                placeholder="I'm grateful for..."
                value={dailyReflection.gratefulFor}
                onChangeText={(text) => updateDailyReflection('gratefulFor', text)}
                multiline
                numberOfLines={2}
                variant="glass"
              />
            </View>

            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>What's your intention for tomorrow?</Text>
              <TextField
                placeholder="Tomorrow I will..."
                value={dailyReflection.tomorrowIntention}
                onChangeText={(text) => updateDailyReflection('tomorrowIntention', text)}
                multiline
                numberOfLines={2}
                variant="glass"
              />
            </View>

            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>
                What additional things do you want to add to your To-Do list tomorrow?
              </Text>
              
              <View style={styles.todoInputContainer}>
                <TextField
                  placeholder="Add a task..."
                  value={todoInput}
                  onChangeText={setTodoInput}
                  variant="glass"
                  style={styles.todoInput}
                  onSubmitEditing={addTodo}
                />
                <GlassButton
                  title="Add"
                  variant="solid"
                  gradient={theme.gradient.vibrant}
                  size="sm"
                  onPress={addTodo}
                  disabled={!todoInput.trim()}
                />
              </View>

              {dailyReflection.tomorrowTodos.map((todo, index) => (
                <GlassCard
                  key={index}
                  variant="light"
                  padding="sm"
                  style={styles.todoItem}
                >
                  <Text style={styles.todoText}>{todo}</Text>
                  <TouchableOpacity
                    onPress={() => removeTodo(index)}
                    style={styles.todoRemove}
                  >
                    <Text style={styles.todoRemoveText}>×</Text>
                  </TouchableOpacity>
                </GlassCard>
              ))}
            </View>

            <GlassButton
              title="Save & Close"
              variant="solid"
              gradient={theme.gradient.vibrant}
              size="lg"
              fullWidth
              onPress={saveDailyReflection}
              style={styles.saveButton}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <Modal
      visible={showDailyReflection}
      transparent
      animationType="slide"
      onRequestClose={closeDailyReflection}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={closeDailyReflection}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            {renderProgressIndicator()}
            <TouchableOpacity
              onPress={closeDailyReflection}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {reflectionStep === 'checkin' ? renderCheckInScreen() : renderJournalScreen()}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },

  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },

  progressDots: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  progressDotActive: {
    backgroundColor: theme.color.primary,
  },

  progressText: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.inverse,
    opacity: 0.7,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: theme.font.size.xl,
    color: theme.color.text.inverse,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },

  screenContent: {
    flex: 1,
    justifyContent: 'center',
  },

  questionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },

  questionLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.inverse,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  },

  question: {
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.inverse,
    textAlign: 'center',
    lineHeight: theme.font.size.xxl * 1.3,
  },

  responseButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },

  responseButton: {
    flex: 1,
  },

  blockerPrompt: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },

  emojiChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  emojiChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: theme.color.primary,
  },

  emojiText: {
    fontSize: theme.font.size.lg,
  },

  emojiLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.inverse,
  },

  blockerInput: {
    marginBottom: theme.spacing.lg,
  },

  continueButton: {
    marginTop: theme.spacing.md,
  },

  keyboardAvoid: {
    flex: 1,
  },

  journalScroll: {
    flex: 1,
  },

  journalContent: {
    paddingBottom: theme.spacing.xxl,
  },

  journalContainer: {
    paddingTop: theme.spacing.lg,
  },

  journalTitle: {
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  journalSection: {
    marginBottom: theme.spacing.xl,
  },

  journalLabel: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.inverse,
    marginBottom: theme.spacing.sm,
  },

  todoInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  todoInput: {
    flex: 1,
  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  todoText: {
    flex: 1,
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
  },

  todoRemove: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  todoRemoveText: {
    fontSize: theme.font.size.lg,
    color: theme.color.error,
  },

  saveButton: {
    marginTop: theme.spacing.xl,
  },
})