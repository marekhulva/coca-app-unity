import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassButton } from '../../components/GlassButton'
import { TextField } from '../../components/TextField'
import { DatePicker } from '../../components/DatePicker'
import { GlassCard } from '../../components/GlassCard'
import { DevSkipButton } from '../../components/DevSkipButton'
import { ScreenLayout } from '../../layouts/ScreenLayout'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import { PRESET_GOALS } from '../../constants'

export const GoalSetupScreen: React.FC = () => {
  const {
    selectedGoal,
    goalMetric,
    goalDeadline,
    goalWhy,
    selectedSharingOption,
    setSelectedGoal,
    setGoalMetric,
    setGoalDeadline,
    setGoalWhy,
    setSelectedSharingOption,
    lockInGoal,
  } = useAppStore()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Update progress bar based on form completion
  useEffect(() => {
    let progress = 0
    if (selectedGoal) progress += 0.25
    if (goalMetric) progress += 0.25
    if (goalDeadline) progress += 0.25
    if (goalWhy) progress += 0.25

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [selectedGoal, goalMetric, goalDeadline, goalWhy, progressAnim])

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 2)

  const PresetGoalButton = ({ goal, index }: { goal: string; index: number }) => {
    const isSelected = selectedGoal === goal
    const buttonScale = useRef(new Animated.Value(1)).current

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start()
      setSelectedGoal(goal)
    }

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: buttonScale },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {isSelected ? (
            <LinearGradient
              colors={theme.gradient.vibrant}
              style={styles.presetButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.presetButtonText, styles.selectedPresetText]}>
                {goal}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.presetButton, styles.unselectedPresetButton]}>
              <Text style={[styles.presetButtonText, styles.unselectedPresetText]}>
                {goal}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const SharingOption = ({ option, label }: { option: string; label: string }) => {
    const isSelected = selectedSharingOption === option
    const optionScale = useRef(new Animated.Value(1)).current

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(optionScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(optionScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start()
      setSelectedSharingOption(option as 'public' | 'private')
    }

    return (
      <Animated.View
        style={[
          styles.sharingOption,
          { transform: [{ scale: optionScale }] },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <GlassCard
            variant={isSelected ? 'dark' : 'light'}
            intensity={isSelected ? 95 : 85}
            padding="md"
            style={styles.sharingCard}
          >
            {isSelected && (
              <LinearGradient
                colors={theme.gradient.vibrant}
                style={styles.sharingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={styles.sharingIcon}>
              {option === 'public' ? '🌍' : '🔒'}
            </Text>
            <Text style={[
              styles.sharingLabel,
              isSelected && styles.selectedSharingLabel,
            ]}>
              {label}
            </Text>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const handleLockInGoal = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    lockInGoal()
    setIsLoading(false)
  }

  return (
    <ScreenLayout gradient={theme.gradient.aurora}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={theme.gradient.vibrant}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>
        <Text style={styles.stepIndicator}>Step 1 of 4</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>What's your goal?</Text>
                <Text style={styles.subtitle}>
                  Let's turn your ambition into achievement ✨
                </Text>
              </View>
              <DevSkipButton />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            }}
          >
            <GlassCard variant="light" intensity={90} padding="lg" style={styles.card}>
              <TextField
                label="My goal is to..."
                placeholder="e.g., Run a marathon"
                value={selectedGoal}
                onChangeText={setSelectedGoal}
              />

              <View style={styles.presetContainer}>
                <Text style={styles.presetLabel}>Popular goals</Text>
                <View style={styles.presetButtons}>
                  {PRESET_GOALS.map((goal, index) => (
                    <PresetGoalButton key={goal} goal={goal} index={index} />
                  ))}
                </View>
              </View>

              <TextField
                label="How will you measure success?"
                placeholder="e.g., Complete 26.2 miles"
                value={goalMetric}
                onChangeText={setGoalMetric}
                hint="Be specific and measurable"
              />

              <DatePicker
                label="Target deadline"
                value={goalDeadline}
                onChange={setGoalDeadline}
                minimumDate={tomorrow}
                maximumDate={maxDate}
              />

              <TextField
                label="Why is this important to you?"
                placeholder="Your deeper motivation..."
                value={goalWhy}
                onChangeText={setGoalWhy}
                multiline
                numberOfLines={3}
                hint="This will help you stay motivated when things get tough"
              />
            </GlassCard>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              }],
            }}
          >
            <View style={styles.privacySection}>
              <Text style={styles.privacyLabel}>Share your journey</Text>
              <View style={styles.privacyButtons}>
                <SharingOption option="public" label="Public" />
                <SharingOption option="private" label="Private" />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              }],
            }}
          >
            <GlassButton
              title="Lock In Goal 🎯"
              gradient={theme.gradient.vibrant}
              variant="solid"
              size="lg"
              fullWidth
              onPress={handleLockInGoal}
              disabled={!selectedGoal || !goalMetric || !goalDeadline}
              loading={isLoading}
              style={styles.continueButton}
            />
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  stepIndicator: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.secondary,
    textAlign: 'center',
    fontWeight: theme.font.weight.medium,
  },
  
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  
  titleContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -1.5,
  },
  
  subtitle: {
    fontSize: 18,
    color: theme.color.text.secondary,
    opacity: 0.8,
  },
  
  card: {
    marginBottom: theme.spacing.xl,
    borderRadius: 24,
  },
  
  presetContainer: {
    marginBottom: theme.spacing.lg,
  },
  
  presetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  
  unselectedPresetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  selectedPresetText: {
    color: 'white',
  },
  
  unselectedPresetText: {
    color: theme.color.text.secondary,
  },
  
  privacySection: {
    marginBottom: theme.spacing.xl,
  },
  
  privacyLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  privacyButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  sharingOption: {
    flex: 1,
  },
  
  sharingCard: {
    position: 'relative',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 120,
    justifyContent: 'center',
  },
  
  sharingGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  
  sharingIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  
  sharingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.color.text.primary,
  },
  
  selectedSharingLabel: {
    color: theme.color.primary,
  },
  
  continueButton: {
    marginTop: theme.spacing.md,
    elevation: 8,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
})