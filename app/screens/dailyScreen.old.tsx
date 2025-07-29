import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from '../components/GlassCard'
import { ProgressRing } from '../components/ProgressRing'
import { Checkbox } from '../components/Checkbox'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'

export const DailyScreen: React.FC = () => {
  const {
    userGoals,
    userActions,
    checkedActions,
    toggleAction,
    openSMSFlow,
  } = useAppStore()

  const progress = useMemo(() => {
    const goalActions = userActions.filter(a => a.type === 'goal')
    const performanceActions = userActions.filter(a => a.type === 'performance')
    
    const goalCompleted = goalActions.filter(a => checkedActions[a.id]).length
    const performanceCompleted = performanceActions.filter(a => checkedActions[a.id]).length
    
    const goalProgress = goalActions.length > 0 
      ? (goalCompleted / goalActions.length) * 100 
      : 0
    const performanceProgress = performanceActions.length > 0 
      ? (performanceCompleted / performanceActions.length) * 100 
      : 0
    const overallProgress = userActions.length > 0
      ? ((goalCompleted + performanceCompleted) / userActions.length) * 100
      : 0

    return {
      goal: Math.round(goalProgress),
      performance: Math.round(performanceProgress),
      overall: Math.round(overallProgress),
      completed: goalCompleted + performanceCompleted,
      total: userActions.length,
    }
  }, [userActions, checkedActions])

  const renderAction = (action: typeof userActions[0]) => {
    const isChecked = checkedActions[action.id] || false
    
    return (
      <TouchableOpacity
        key={action.id}
        style={styles.actionItem}
        onPress={() => toggleAction(action.id)}
        activeOpacity={0.7}
      >
        <Checkbox
          checked={isChecked}
          onChange={() => toggleAction(action.id)}
          size="lg"
        />
        <View style={styles.actionContent}>
          <Text style={[
            styles.actionName,
            isChecked && styles.completedText
          ]}>
            {action.name}
          </Text>
          {action.schedule && (
            <Text style={styles.actionSchedule}>{action.schedule}</Text>
          )}
        </View>
        <View style={[
          styles.actionType,
          action.type === 'goal' ? styles.goalType : styles.performanceType
        ]}>
          <Text style={styles.actionTypeText}>
            {action.type === 'goal' ? 'Goal' : 'Habit'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient.primary}
        style={styles.gradient}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Today's Focus</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.progressContainer}>
          <ProgressRing
            progress={progress.overall}
            size={180}
            strokeWidth={16}
            color={theme.color.primary}
            showPercentage
          />
          <Text style={styles.progressLabel}>
            {progress.completed} of {progress.total} completed
          </Text>
        </View>

        <View style={styles.statsRow}>
          <GlassCard variant="light" padding="md" style={styles.statCard}>
            <Text style={styles.statValue}>{progress.goal}%</Text>
            <Text style={styles.statLabel}>Goal Actions</Text>
          </GlassCard>
          
          <GlassCard variant="light" padding="md" style={styles.statCard}>
            <Text style={styles.statValue}>{progress.performance}%</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </GlassCard>
        </View>

        {userGoals.map((goal) => (
          <GlassCard
            key={goal.id}
            variant="light"
            padding="lg"
            style={styles.goalCard}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <View style={styles.goalProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${goal.progress}%` }]} 
                  />
                </View>
                <Text style={styles.goalDays}>
                  {Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                </Text>
              </View>
            </View>
            
            <View style={styles.actionsContainer}>
              {userActions
                .filter(a => a.goalId === goal.id)
                .map(renderAction)}
            </View>
          </GlassCard>
        ))}

        <GlassCard
          variant="light"
          padding="lg"
          style={styles.reviewCard}
          onPress={openSMSFlow}
        >
          <View style={styles.reviewContent}>
            <View style={styles.reviewIcon}>
              <Text style={styles.reviewEmoji}>📝</Text>
            </View>
            <View style={styles.reviewText}>
              <Text style={styles.reviewTitle}>Daily Review</Text>
              <Text style={styles.reviewSubtitle}>
                Reflect on your progress and plan tomorrow
              </Text>
            </View>
            <Text style={styles.reviewArrow}>→</Text>
          </View>
        </GlassCard>
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
  
  date: {
    fontSize: theme.font.size.lg,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  
  progressContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  progressLabel: {
    fontSize: theme.font.size.md,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.primary,
    marginBottom: theme.spacing.xs,
  },
  
  statLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  goalCard: {
    marginBottom: theme.spacing.lg,
  },
  
  goalHeader: {
    marginBottom: theme.spacing.lg,
  },
  
  goalTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  goalProgress: {
    gap: theme.spacing.sm,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: theme.color.border.light,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.full,
  },
  
  goalDays: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
  },
  
  actionsContainer: {
    gap: theme.spacing.sm,
  },
  
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  
  actionContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  
  actionName: {
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
    fontWeight: theme.font.weight.medium,
  },
  
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  
  actionSchedule: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  
  actionType: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  
  goalType: {
    backgroundColor: theme.color.primary,
  },
  
  performanceType: {
    backgroundColor: theme.color.secondary,
  },
  
  actionTypeText: {
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.inverse,
  },
  
  reviewCard: {
    marginTop: theme.spacing.xl,
  },
  
  reviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  reviewIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.glass.blur,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  reviewEmoji: {
    fontSize: 24,
  },
  
  reviewText: {
    flex: 1,
  },
  
  reviewTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  reviewSubtitle: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  reviewArrow: {
    fontSize: theme.font.size.xl,
    color: theme.color.text.tertiary,
  },
})