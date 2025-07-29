import React, { useRef, useEffect } from 'react'
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

  return (
    <ScreenLayout gradient={theme.gradient.aurora}>
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
            <Text style={styles.title}>What's your goal?</Text>
            <Text style={styles.subtitle}>
              Let's turn your ambition into achievement ✨
            </Text>
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
                variant="glass"
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
                variant="glass"
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
                variant="glass"
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
              onPress={lockInGoal}
              disabled={!selectedGoal || !goalMetric || !goalDeadline}
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
  
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
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
    marginBottom: theme.spacing.xl,
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