import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassButton } from '../../components/GlassButton'
import { GlassCard } from '../../components/GlassCard'
import { Checkbox } from '../../components/Checkbox'
import { TextField } from '../../components/TextField'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import { SUGGESTED_PERFORMANCE_HABITS, BLOCKER_EMOJIS } from '../../constants'
import * as Haptics from 'expo-haptics'

// Habit icons for visual interest
const HABIT_ICONS: { [key: string]: string } = {
  'Morning Meditation': '🧘',
  'Exercise': '💪',
  'Journaling': '📝',
  'Reading': '📚',
  'Deep Work': '🎯',
  'Gratitude Practice': '🙏',
  'Evening Review': '🌙',
}

export const PerformanceHabitsScreen: React.FC = () => {
  const {
    performanceHabits,
    togglePerformanceHabit,
    updateHabitTime,
    toggleHabitReminder,
    completeBoosters,
    currentStep,
  } = useAppStore()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnims = useRef(
    SUGGESTED_PERFORMANCE_HABITS.map(() => new Animated.Value(0.9))
  ).current
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start()

    // Staggered card animations
    scaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 100,
        tension: 50,
        friction: 7,
        useNativeDriver: Platform.OS !== 'web',
      }).start()
    })
  }, [])

  const isHabitSelected = (habitName: string) => {
    return performanceHabits.some(h => h.name === habitName)
  }

  const getHabitTime = (habitName: string) => {
    const habit = performanceHabits.find(h => h.name === habitName)
    return habit?.time || ''
  }

  const hasReminder = (habitName: string) => {
    const habit = performanceHabits.find(h => h.name === habitName)
    return habit?.reminder || false
  }

  const handleHabitPress = async (habitName: string, index: number) => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start()

    togglePerformanceHabit(habitName)
  }

  const handleContinue = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    completeBoosters()
    setIsLoading(false)
  }

  const renderProgressHeader = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressDots}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              step <= currentStep && styles.progressDotActive,
              step === currentStep && styles.progressDotCurrent,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>Step {currentStep} of 4</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient.cosmic}
        style={styles.gradient}
      />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {renderProgressHeader()}
        
        <View style={styles.header}>
          <Text style={styles.title}>Daily Performance Boosters</Text>
          <Text style={styles.subtitle}>
            Select habits that will accelerate your progress
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{performanceHabits.length}</Text>
              <Text style={styles.statLabel}>Selected</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {performanceHabits.filter(h => h.reminder).length}
              </Text>
              <Text style={styles.statLabel}>Reminders</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.habitsContainer}>
            {SUGGESTED_PERFORMANCE_HABITS.map((habit, index) => {
              const selected = isHabitSelected(habit.name)
              const icon = HABIT_ICONS[habit.name] || '⭐'
              
              return (
                <Animated.View
                  key={habit.name}
                  style={{
                    transform: [{ scale: scaleAnims[index] }],
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleHabitPress(habit.name, index)}
                  >
                    <GlassCard
                      variant={selected ? 'dark' : 'light'}
                      intensity={selected ? 95 : 90}
                      padding="lg"
                      style={[styles.habitCard, selected && styles.selectedCard]}
                    >
                      <View style={styles.habitHeader}>
                        <View style={[
                          styles.iconContainer,
                          selected && styles.iconContainerSelected
                        ]}>
                          <Text style={styles.habitIcon}>{icon}</Text>
                        </View>
                        
                        <View style={styles.habitInfo}>
                          <Text style={[
                            styles.habitName,
                            selected && styles.habitNameSelected
                          ]}>
                            {habit.name}
                          </Text>
                          <Text style={[
                            styles.habitTip,
                            selected && styles.habitTipSelected
                          ]}>
                            {habit.tip}
                          </Text>
                        </View>
                        
                        <Animated.View
                          style={[
                            styles.checkboxContainer,
                            {
                              transform: [{
                                scale: selected ? 1 : 0.8,
                              }],
                              opacity: selected ? 1 : 0.6,
                            }
                          ]}
                        >
                          <Checkbox
                            checked={selected}
                            onChange={() => handleHabitPress(habit.name, index)}
                            size="lg"
                          />
                        </Animated.View>
                      </View>
                      
                      {selected && (
                        <Animated.View
                          style={[
                            styles.habitSettings,
                            {
                              opacity: selected ? 1 : 0,
                              maxHeight: selected ? 200 : 0,
                            }
                          ]}
                        >
                          <View style={styles.settingRow}>
                            <Text style={styles.settingIcon}>⏰</Text>
                            <TextField
                              placeholder="Set time (e.g., 7:00 AM)"
                              value={getHabitTime(habit.name)}
                              onChangeText={(time) => updateHabitTime(habit.name, time)}
                              style={styles.timeInput}
                            />
                          </View>
                          
                          <TouchableOpacity
                            style={[
                              styles.reminderButton,
                              hasReminder(habit.name) && styles.reminderButtonActive
                            ]}
                            onPress={() => toggleHabitReminder(habit.name)}
                          >
                            <Text style={styles.reminderIcon}>
                              {hasReminder(habit.name) ? '🔔' : '🔕'}
                            </Text>
                            <Text style={[
                              styles.reminderText,
                              hasReminder(habit.name) && styles.reminderTextActive
                            ]}>
                              {hasReminder(habit.name) ? 'Reminder On' : 'Add Reminder'}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>
              )
            })}
          </View>

          <GlassButton
            title={`Continue with ${performanceHabits.length} Habits`}
            variant="solid"
            gradient={theme.gradient.vibrant}
            size="lg"
            fullWidth
            onPress={handleContinue}
            disabled={performanceHabits.length === 0}
            loading={isLoading}
            style={styles.continueButton}
          />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.primary,
  },
  
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 400,
    opacity: 0.15,
  },
  
  content: {
    flex: 1,
  },
  
  progressContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  
  progressDots: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.color.glass.blur,
  },
  
  progressDotActive: {
    backgroundColor: theme.color.primary,
  },
  
  progressDotCurrent: {
    transform: [{ scale: 1.2 }],
  },
  
  progressText: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  title: {
    fontSize: theme.font.size.xxxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  subtitle: {
    fontSize: theme.font.size.lg,
    color: theme.color.text.secondary,
    textAlign: 'center',
    lineHeight: theme.font.size.lg * 1.4,
    marginBottom: theme.spacing.lg,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  stat: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  
  statNumber: {
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.primary,
  },
  
  statLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.xs,
  },
  
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.color.border.light,
  },
  
  habitsContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  habitCard: {
    marginBottom: theme.spacing.md,
  },
  
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.color.primary,
  },
  
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.color.glass.blur,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  iconContainerSelected: {
    backgroundColor: theme.color.primary,
  },
  
  habitIcon: {
    fontSize: 28,
  },
  
  habitInfo: {
    flex: 1,
  },
  
  habitName: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  habitNameSelected: {
    color: theme.color.primary,
  },
  
  habitTip: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  habitTipSelected: {
    color: theme.color.text.primary,
  },
  
  checkboxContainer: {
    marginLeft: theme.spacing.md,
  },
  
  habitSettings: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.color.glass.blur,
    overflow: 'hidden',
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  settingIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  
  timeInput: {
    flex: 1,
  },
  
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.glass.blur,
    alignSelf: 'flex-start',
  },
  
  reminderButtonActive: {
    backgroundColor: theme.color.primary,
  },
  
  reminderIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  
  reminderText: {
    fontSize: theme.font.size.md,
    color: theme.color.text.secondary,
    fontWeight: theme.font.weight.medium,
  },
  
  reminderTextActive: {
    color: theme.color.text.inverse,
  },
  
  continueButton: {
    marginTop: theme.spacing.md,
    ...Platform.select({
      ios: theme.shadow.lg,
      android: { elevation: 8 },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
})