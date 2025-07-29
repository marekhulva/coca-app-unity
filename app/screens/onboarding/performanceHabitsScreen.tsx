import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from '../../components/Button'
import { GlassCard } from '../../components/GlassCard'
import { Checkbox } from '../../components/Checkbox'
import { TextField } from '../../components/TextField'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import { SUGGESTED_PERFORMANCE_HABITS } from '../../constants'

export const PerformanceHabitsScreen: React.FC = () => {
  const {
    performanceHabits,
    togglePerformanceHabit,
    updateHabitTime,
    toggleHabitReminder,
    completeBoosters,
  } = useAppStore()

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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient.secondary}
        style={styles.gradient}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Daily Performance Boosters</Text>
        <Text style={styles.subtitle}>
          Select habits that will accelerate your progress
        </Text>

        <View style={styles.habitsContainer}>
          {SUGGESTED_PERFORMANCE_HABITS.map((habit) => {
            const selected = isHabitSelected(habit.name)
            
            return (
              <GlassCard
                key={habit.name}
                variant="light"
                padding="md"
                style={[styles.habitCard, selected && styles.selectedCard]}
                onPress={() => togglePerformanceHabit(habit.name)}
              >
                <View style={styles.habitHeader}>
                  <Checkbox
                    checked={selected}
                    onChange={() => togglePerformanceHabit(habit.name)}
                    size="lg"
                  />
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitTip}>{habit.tip}</Text>
                  </View>
                </View>
                
                {selected && (
                  <View style={styles.habitSettings}>
                    <TextField
                      placeholder="Time (e.g., 7:00 AM)"
                      value={getHabitTime(habit.name)}
                      onChangeText={(time) => updateHabitTime(habit.name, time)}
                      style={styles.timeInput}
                    />
                    <View style={styles.reminderContainer}>
                      <Checkbox
                        checked={hasReminder(habit.name)}
                        onChange={() => toggleHabitReminder(habit.name)}
                        label="Reminder"
                        size="sm"
                      />
                    </View>
                  </View>
                )}
              </GlassCard>
            )
          })}
        </View>

        <Button
          title="Continue"
          variant="primary"
          size="lg"
          fullWidth
          onPress={completeBoosters}
          disabled={performanceHabits.length === 0}
          style={styles.continueButton}
        />
      </ScrollView>
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
    height: 300,
    opacity: 0.1,
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
    marginBottom: theme.spacing.xl,
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
    alignItems: 'flex-start',
  },
  
  habitInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  
  habitName: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  habitTip: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  habitSettings: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.color.border.light,
  },
  
  timeInput: {
    marginBottom: theme.spacing.sm,
  },
  
  reminderContainer: {
    marginLeft: theme.spacing.md,
  },
  
  continueButton: {
    marginTop: theme.spacing.md,
  },
})