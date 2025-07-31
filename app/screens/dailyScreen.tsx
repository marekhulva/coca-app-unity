import React, { useMemo, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from '../components/GlassCard'
import { ProgressRing } from '../components/ProgressRing'
import { GlassButton } from '../components/GlassButton'
import { ScreenLayout } from '../layouts/ScreenLayout'
import { ShareActionModal } from './modals/shareActionModal'
import { DailyReflectionModal } from './modals/dailyReflectionModal'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'

const { width } = Dimensions.get('window')

export const DailyScreen: React.FC = () => {
  const {
    userGoals,
    userActions,
    checkedActions,
    toggleAction,
    openSMSFlow,
    openDailyReflection,
    dailyReflection,
  } = useAppStore()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start()
  }, [])

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

  const renderAction = (action: typeof userActions[0], index: number) => {
    const isChecked = checkedActions[action.id] || false
    const animValue = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: Platform.OS !== 'web',
      }).start()
    }, [])
    
    return (
      <Animated.View
        key={action.id}
        style={{
          opacity: animValue,
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => toggleAction(action.id)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            isChecked && styles.checkboxChecked,
          ]}>
            {isChecked && (
              <LinearGradient
                colors={theme.gradient.vibrant}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <Text style={styles.checkmark}>{isChecked ? '✓' : ''}</Text>
          </View>
          
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
            { backgroundColor: action.type === 'goal' ? '#FF006E' : '#8338EC' }
          ]}>
            <Text style={styles.actionTypeText}>
              {action.type === 'goal' ? 'Goal' : 'Habit'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <ScreenLayout gradient={theme.gradient.cosmic}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.greeting}>Good morning, Alex! ☀️</Text>
        <Text style={styles.title}>Today's Mission</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {dailyReflection.tomorrowIntention && (
          <Animated.View
            style={[
              styles.intentionCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <GlassCard variant="light" intensity={95} style={styles.intentionContent}>
              <Text style={styles.intentionLabel}>Today's Intention</Text>
              <Text style={styles.intentionText}>{dailyReflection.tomorrowIntention}</Text>
            </GlassCard>
          </Animated.View>
        )}

        <Animated.View style={[
          styles.progressContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <GlassCard
            variant="light"
            intensity={95}
            style={styles.progressCard}
          >
            <ProgressRing
              progress={progress.overall}
              size={160}
              strokeWidth={14}
              color={'#FF006E'}
              backgroundColor={'rgba(255, 255, 255, 0.3)'}
              showPercentage
            />
            <Text style={styles.progressLabel}>
              {progress.completed} of {progress.total} completed
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#FF006E', '#8338EC']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statValue}>{progress.goal}%</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Goals</Text>
              </View>
              
              <View style={styles.statItem}>
                <LinearGradient
                  colors={['#8338EC', '#3A86FF']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statValue}>{progress.performance}%</Text>
                </LinearGradient>
                <Text style={styles.statLabel}>Habits</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {userGoals.map((goal) => (
          <GlassCard
            key={goal.id}
            variant="light"
            intensity={90}
            padding="lg"
            style={styles.goalCard}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.goalMeta}>
                  <LinearGradient
                    colors={['rgba(255, 0, 110, 0.1)', 'rgba(131, 56, 236, 0.1)']}
                    style={styles.progressBar}
                  >
                    <LinearGradient
                      colors={theme.gradient.vibrant}
                      style={[styles.progressFill, { width: `${goal.progress}%` }]}
                    />
                  </LinearGradient>
                  <Text style={styles.goalDays}>
                    {Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
                  </Text>
                </View>
              </View>
              <View style={styles.goalIcon}>
                <Text style={styles.goalEmoji}>🎯</Text>
              </View>
            </View>
            
            <View style={styles.actionsContainer}>
              {userActions
                .filter(a => a.goalId === goal.id)
                .map((action, index) => renderAction(action, index))}
            </View>
          </GlassCard>
        ))}

        <TouchableOpacity
          style={styles.reviewCard}
          onPress={openDailyReflection}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={theme.gradient.sunset}
            style={styles.reviewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.reviewContent}>
              <View>
                <Text style={styles.reviewTitle}>Daily Reflection</Text>
                <Text style={styles.reviewSubtitle}>
                  5 minutes to review and plan ahead
                </Text>
              </View>
              <View style={styles.reviewIcon}>
                <Text style={styles.reviewEmoji}>📝</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
      
      {/* Test buttons for debugging modals */}
      <View style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        gap: 10,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF006E',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginBottom: 10,
          }}
          onPress={() => {
            useAppStore.setState({
              shareAction: {
                id: 'test-action',
                goalId: 'test-goal',
                type: 'goal',
                name: 'Test Action for Debugging',
              },
              showShareModal: true,
            })
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Test Share Modal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#8338EC',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => {
            useAppStore.getState().openDailyReflection()
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Test Daily Reflection</Text>
        </TouchableOpacity>
      </View>
      
      <ShareActionModal />
      <DailyReflectionModal />
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
  },
  
  greeting: {
    fontSize: 16,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.color.text.primary,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
  },
  
  date: {
    fontSize: 16,
    color: theme.color.text.tertiary,
    marginBottom: theme.spacing.xl,
  },
  
  progressContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  progressCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderRadius: 24,
  },
  
  progressLabel: {
    fontSize: 16,
    color: theme.color.text.secondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  
  statLabel: {
    fontSize: 14,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  
  goalCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: 24,
  },
  
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  goalInfo: {
    flex: 1,
  },
  
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  goalDays: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8338EC',
  },
  
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 0, 110, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  goalEmoji: {
    fontSize: 24,
  },
  
  actionsContainer: {
    gap: theme.spacing.sm,
  },
  
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.color.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  
  checkboxChecked: {
    borderColor: 'transparent',
  },
  
  checkmark: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  
  actionContent: {
    flex: 1,
  },
  
  actionName: {
    fontSize: 16,
    color: theme.color.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  
  actionSchedule: {
    fontSize: 13,
    color: theme.color.text.tertiary,
  },
  
  actionType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  
  actionTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
  },
  
  reviewCard: {
    marginTop: theme.spacing.xl,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  
  reviewGradient: {
    padding: theme.spacing.xl,
  },
  
  reviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: theme.spacing.xs,
  },
  
  reviewSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  reviewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  reviewEmoji: {
    fontSize: 28,
  },
  
  intentionCard: {
    marginVertical: theme.spacing.lg,
  },
  
  intentionContent: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  
  intentionLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  intentionText: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    fontStyle: 'italic',
  },
})