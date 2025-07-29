import React, { useMemo, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from '../components/GlassCard'
import { ProgressRing } from '../components/ProgressRing'
import { ScreenLayout } from '../layouts/ScreenLayout'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'

const { width } = Dimensions.get('window')

export const ProgressScreen: React.FC = () => {
  const {
    progressTab,
    userGoals,
    userActions,
    checkedActions,
    expandedGoalId,
    setExpandedGoalId,
  } = useAppStore((state) => ({
    progressTab: state.progressTab,
    userGoals: state.userGoals,
    userActions: state.userActions,
    checkedActions: state.checkedActions,
    expandedGoalId: state.expandedGoalId,
    setExpandedGoalId: (id: string | null) => state.expandedGoalId = id,
  }))

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

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
    ]).start()
  }, [])

  const userStats = useMemo(() => {
    const totalActions = userActions.length
    const completedActions = Object.values(checkedActions).filter(Boolean).length
    const streak = 7
    const bestStreak = 14
    
    return {
      totalActions,
      completedActions,
      completionRate: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0,
      streak,
      bestStreak,
    }
  }, [userActions, checkedActions])

  const keyMetrics = useMemo(() => {
    return userGoals.map(goal => {
      const goalActions = userActions.filter(a => a.goalId === goal.id)
      const completedGoalActions = goalActions.filter(a => checkedActions[a.id]).length
      const progress = goalActions.length > 0 
        ? Math.round((completedGoalActions / goalActions.length) * 100)
        : 0
      
      return {
        goalId: goal.id,
        title: goal.title,
        progress,
        daysLeft: Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        milestones: goal.milestones,
        actions: goalActions,
      }
    })
  }, [userGoals, userActions, checkedActions])

  const groupStats = {
    totalMembers: 42,
    averageCompletion: 78,
    topPerformers: [
      { name: 'Sarah', completion: 94, avatar: '👩' },
      { name: 'Mike', completion: 89, avatar: '👨' },
      { name: 'Emma', completion: 87, avatar: '👩‍💼' },
    ],
  }

  const TabButton = ({ id, label, isActive }: { id: string; label: string; isActive: boolean }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start()
      useAppStore.setState({ progressTab: id as 'personal' | 'group' })
    }

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {isActive ? (
            <LinearGradient
              colors={theme.gradient.vibrant}
              style={styles.tabButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.tabLabel, styles.activeTabLabel]}>{label}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.tabButton, styles.inactiveTabButton]}>
              <Text style={[styles.tabLabel, styles.inactiveTabLabel]}>{label}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const StatCard = ({ value, label, gradient, delay }: any) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current
    const opacityAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start()
    }, [delay])

    return (
      <Animated.View style={[
        styles.statCard,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}>
        <LinearGradient
          colors={gradient}
          style={styles.statGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statValue}>{value}</Text>
        </LinearGradient>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    )
  }

  const renderPersonalTab = () => (
    <>
      <View style={styles.statsGrid}>
        <StatCard 
          value={`${userStats.completionRate}%`} 
          label="Completion" 
          gradient={theme.gradient.vibrant}
          delay={0}
        />
        <StatCard 
          value={userStats.streak} 
          label="Day Streak" 
          gradient={theme.gradient.sunset}
          delay={100}
        />
        <StatCard 
          value={userStats.completedActions} 
          label="Actions Done" 
          gradient={theme.gradient.aurora}
          delay={200}
        />
        <StatCard 
          value={userStats.bestStreak} 
          label="Best Streak" 
          gradient={theme.gradient.cosmic}
          delay={300}
        />
      </View>

      <Text style={styles.sectionTitle}>Goal Progress</Text>
      
      {keyMetrics.map((metric, index) => {
        const isExpanded = expandedGoalId === metric.goalId
        
        return (
          <Animated.View
            key={metric.goalId}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setExpandedGoalId(isExpanded ? null : metric.goalId)}
            >
              <GlassCard
                variant="light"
                intensity={90}
                padding="lg"
                style={styles.goalCard}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{metric.title}</Text>
                    <View style={styles.goalMeta}>
                      <LinearGradient
                        colors={['#FF006E', '#8338EC']}
                        style={styles.deadlineContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.goalDeadline}>
                          {metric.daysLeft} days left
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <ProgressRing
                      progress={metric.progress}
                      size={72}
                      strokeWidth={8}
                      color={'#FF006E'}
                      backgroundColor={'rgba(255, 255, 255, 0.3)'}
                      showPercentage
                    />
                  </View>
                </View>
                
                {isExpanded && (
                  <Animated.View style={styles.expandedContent}>
                    <LinearGradient
                      colors={['rgba(255, 0, 110, 0.1)', 'rgba(131, 56, 236, 0.1)']}
                      style={styles.expandedGradient}
                    />
                    
                    <View style={styles.milestonesSection}>
                      <Text style={styles.subsectionTitle}>Milestones</Text>
                      {metric.milestones.map((milestone, idx) => (
                        <View key={idx} style={styles.milestoneItem}>
                          <LinearGradient
                            colors={theme.gradient.vibrant}
                            style={styles.milestoneIndicator}
                          />
                          <View style={styles.milestoneContent}>
                            <Text style={styles.milestoneName}>{milestone.name}</Text>
                            <Text style={styles.milestoneDate}>
                              {milestone.date.toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.actionsSection}>
                      <Text style={styles.subsectionTitle}>Actions</Text>
                      {metric.actions.map((action) => (
                        <View key={action.id} style={styles.actionItem}>
                          <View style={[
                            styles.actionIndicator,
                            checkedActions[action.id] && styles.actionCompleted
                          ]}>
                            {checkedActions[action.id] && (
                              <LinearGradient
                                colors={theme.gradient.vibrant}
                                style={StyleSheet.absoluteFillObject}
                              />
                            )}
                            <Text style={styles.checkmark}>
                              {checkedActions[action.id] ? '✓' : ''}
                            </Text>
                          </View>
                          <Text style={styles.actionName}>{action.name}</Text>
                        </View>
                      ))}
                    </View>
                  </Animated.View>
                )}
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        )
      })}
    </>
  )

  const renderGroupTab = () => (
    <>
      <View style={styles.groupStatsContainer}>
        <GlassCard variant="light" intensity={95} padding="lg" style={styles.groupStatCard}>
          <LinearGradient
            colors={theme.gradient.sunset}
            style={styles.groupStatIcon}
          >
            <Text style={styles.groupStatEmoji}>👥</Text>
          </LinearGradient>
          <Text style={styles.groupStatValue}>{groupStats.totalMembers}</Text>
          <Text style={styles.groupStatLabel}>Active Members</Text>
        </GlassCard>
        
        <GlassCard variant="light" intensity={95} padding="lg" style={styles.groupStatCard}>
          <LinearGradient
            colors={theme.gradient.aurora}
            style={styles.groupStatIcon}
          >
            <Text style={styles.groupStatEmoji}>📊</Text>
          </LinearGradient>
          <Text style={styles.groupStatValue}>{groupStats.averageCompletion}%</Text>
          <Text style={styles.groupStatLabel}>Avg Completion</Text>
        </GlassCard>
      </View>

      <Text style={styles.sectionTitle}>Top Performers</Text>
      
      {groupStats.topPerformers.map((performer, index) => (
        <Animated.View
          key={performer.name}
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30 * (index + 1), 0],
              }),
            }],
          }}
        >
          <GlassCard
            variant="light"
            intensity={90}
            padding="md"
            style={styles.performerCard}
          >
            <LinearGradient
              colors={
                index === 0 ? ['#FFD700', '#FFA500'] :
                index === 1 ? ['#C0C0C0', '#808080'] :
                ['#CD7F32', '#8B4513']
              }
              style={styles.rankBadge}
            >
              <Text style={styles.rankNumber}>#{index + 1}</Text>
            </LinearGradient>
            
            <Text style={styles.performerAvatar}>{performer.avatar}</Text>
            
            <View style={styles.performerInfo}>
              <Text style={styles.performerName}>{performer.name}</Text>
              <View style={styles.performerProgress}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={theme.gradient.vibrant}
                    style={[styles.progressFill, { width: `${performer.completion}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={styles.performerCompletion}>{performer.completion}%</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ))}
    </>
  )

  return (
    <ScreenLayout gradient={theme.gradient.fire}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.title}>Progress Tracking</Text>
        <Text style={styles.subtitle}>Monitor your journey to success</Text>
        
        <View style={styles.tabContainer}>
          <TabButton 
            id="personal" 
            label="Personal" 
            isActive={progressTab === 'personal'} 
          />
          <TabButton 
            id="group" 
            label="Group" 
            isActive={progressTab === 'group'} 
          />
        </View>
        
        <View style={styles.tabContent}>
          {progressTab === 'personal' ? renderPersonalTab() : renderGroupTab()}
        </View>
      </Animated.ScrollView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.color.text.primary,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
  },
  
  subtitle: {
    fontSize: 16,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  
  tabContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  
  tabButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  
  inactiveTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  tabLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  
  activeTabLabel: {
    color: 'white',
  },
  
  inactiveTabLabel: {
    color: theme.color.text.secondary,
  },
  
  tabContent: {
    marginTop: theme.spacing.sm,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
    marginBottom: theme.spacing.xxl,
  },
  
  statCard: {
    width: '50%',
    padding: theme.spacing.xs,
    alignItems: 'center',
  },
  
  statGradient: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
  },
  
  statLabel: {
    fontSize: 14,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  goalCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: 24,
  },
  
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  goalInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
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
  },
  
  deadlineContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  
  goalDeadline: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  progressContainer: {
    alignItems: 'center',
  },
  
  expandedContent: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    position: 'relative',
  },
  
  expandedGradient: {
    position: 'absolute',
    top: 0,
    left: -theme.spacing.lg,
    right: -theme.spacing.lg,
    height: 1,
  },
  
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  milestonesSection: {
    marginBottom: theme.spacing.xl,
  },
  
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  milestoneIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
  },
  
  milestoneContent: {
    flex: 1,
  },
  
  milestoneName: {
    fontSize: 15,
    color: theme.color.text.primary,
    fontWeight: '500',
  },
  
  milestoneDate: {
    fontSize: 13,
    color: theme.color.text.tertiary,
    marginTop: 2,
  },
  
  actionsSection: {},
  
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  actionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.color.border.default,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  actionCompleted: {
    borderColor: 'transparent',
  },
  
  checkmark: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  
  actionName: {
    fontSize: 15,
    color: theme.color.text.primary,
    flex: 1,
  },
  
  groupStatsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  
  groupStatCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 24,
  },
  
  groupStatIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  
  groupStatEmoji: {
    fontSize: 28,
  },
  
  groupStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  groupStatLabel: {
    fontSize: 14,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderRadius: 20,
  },
  
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  
  performerAvatar: {
    fontSize: 36,
    marginRight: theme.spacing.md,
  },
  
  performerInfo: {
    flex: 1,
  },
  
  performerName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  performerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  
  performerCompletion: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.color.text.secondary,
  },
})