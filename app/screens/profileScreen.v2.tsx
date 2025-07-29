import React, { useState, useRef, useEffect } from 'react'
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
import { GlassButton } from '../components/GlassButton'
import { ScreenLayout } from '../layouts/ScreenLayout'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'

const { width } = Dimensions.get('window')

export const ProfileScreen: React.FC = () => {
  const { user, userGoals, userActions } = useAppStore()
  const [expandedGoals, setExpandedGoals] = useState(false)
  
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ).start(),
    ]).start()
  }, [])

  const finishedGoals = []
  const performanceHabits = userActions.filter(a => a.type === 'performance')
  
  const stats = {
    totalGoals: userGoals.length + finishedGoals.length,
    activeGoals: userGoals.length,
    completedGoals: finishedGoals.length,
    totalHabits: performanceHabits.length,
  }

  const userPosts = [
    {
      id: '1',
      content: 'Started my journey today! Excited to see where this takes me 🚀',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reactions: { '🔥': 12, '💪': 8 },
    },
    {
      id: '2',
      content: 'Day 3: Feeling the momentum building up!',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      reactions: { '👏': 6, '🎯': 4 },
    },
  ]

  const achievements = [
    { icon: '🎯', title: 'Goal Setter', desc: 'Created first goal' },
    { icon: '🔥', title: 'On Fire', desc: '7 day streak' },
    { icon: '⭐', title: 'Rising Star', desc: 'Joined community' },
  ]

  return (
    <ScreenLayout gradient={theme.gradient.cosmic}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={[
          styles.header,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <View style={styles.avatarContainer}>
            <Animated.View style={[
              styles.avatarGlow,
              {
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              },
            ]}>
              <LinearGradient
                colors={theme.gradient.vibrant}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <View style={styles.avatarInner}>
              <Text style={styles.avatar}>{user.avatar}</Text>
            </View>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.statsRow}>
            <Animated.View 
              style={[
                styles.statItem,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={theme.gradient.sunset}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{user.todayStreak}</Text>
              </LinearGradient>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.statItem,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={theme.gradient.aurora}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{user.totalPoints}</Text>
              </LinearGradient>
              <Text style={styles.statLabel}>Total Points</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.statItem,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={theme.gradient.fire}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{stats.totalGoals}</Text>
              </LinearGradient>
              <Text style={styles.statLabel}>Goals Set</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.achievementsScroll}
        >
          {achievements.map((achievement, index) => (
            <Animated.View
              key={achievement.title}
              style={{
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              }}
            >
              <GlassCard
                variant="light"
                intensity={90}
                padding="md"
                style={styles.achievementCard}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </GlassCard>
            </Animated.View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedGoals(!expandedGoals)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>My Goals</Text>
          <View style={styles.expandButton}>
            <LinearGradient
              colors={theme.gradient.vibrant}
              style={styles.expandGradient}
            >
              <Text style={styles.expandIcon}>{expandedGoals ? '−' : '+'}</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        {expandedGoals && (
          <Animated.View style={{
            opacity: fadeAnim,
          }}>
            <Text style={styles.subsectionTitle}>Active Goals</Text>
            {userGoals.map((goal, index) => (
              <Animated.View
                key={goal.id}
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
                <GlassCard
                  variant="light"
                  intensity={85}
                  padding="md"
                  style={styles.goalCard}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalContent}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalMetric}>{goal.metric}</Text>
                    </View>
                    <View style={styles.progressCircle}>
                      <LinearGradient
                        colors={theme.gradient.vibrant}
                        style={styles.progressGradient}
                      >
                        <Text style={styles.progressText}>{goal.progress}%</Text>
                      </LinearGradient>
                    </View>
                  </View>
                  <View style={styles.goalFooter}>
                    <LinearGradient
                      colors={['rgba(255, 0, 110, 0.1)', 'rgba(131, 56, 236, 0.1)']}
                      style={styles.deadlineBadge}
                    >
                      <Text style={styles.goalDeadline}>
                        Due {goal.deadline.toLocaleDateString()}
                      </Text>
                    </LinearGradient>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <Text style={styles.sectionTitle}>Performance Habits</Text>
        <View style={styles.habitsGrid}>
          {performanceHabits.map((habit, index) => (
            <Animated.View
              key={habit.id}
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
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={[
                    index % 2 === 0 ? '#FF006E' : '#8338EC',
                    index % 2 === 0 ? '#8338EC' : '#3A86FF',
                  ]}
                  style={styles.habitCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitSchedule}>{habit.schedule}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {userPosts.map((post, index) => (
          <Animated.View
            key={post.id}
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
            <GlassCard
              variant="light"
              intensity={90}
              padding="lg"
              style={styles.postCard}
            >
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postTimestamp}>
                  {post.timestamp.toLocaleDateString()}
                </Text>
                <View style={styles.postReactions}>
                  {Object.entries(post.reactions).map(([emoji, count]) => (
                    <TouchableOpacity 
                      key={emoji} 
                      style={styles.reaction}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reactionEmoji}>{emoji}</Text>
                      <Text style={styles.reactionCount}>{count}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Edit Profile"
            gradient={theme.gradient.vibrant}
            variant="solid"
            size="lg"
            fullWidth
            onPress={() => console.log('Edit Profile')}
          />
          <GlassButton
            title="Settings"
            variant="glass"
            size="lg"
            fullWidth
            onPress={() => console.log('Settings')}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatarGlow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatarGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.3,
  },
  
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  
  avatar: {
    fontSize: 60,
  },
  
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -1,
  },
  
  userEmail: {
    fontSize: 16,
    color: theme.color.text.secondary,
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
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  
  statLabel: {
    fontSize: 13,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  achievementsScroll: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  
  achievementCard: {
    width: 140,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 20,
  },
  
  achievementIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  achievementDesc: {
    fontSize: 12,
    color: theme.color.text.secondary,
    textAlign: 'center',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  expandGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  expandIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.sm,
  },
  
  goalCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 20,
  },
  
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  goalContent: {
    flex: 1,
  },
  
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  goalMetric: {
    fontSize: 14,
    color: theme.color.text.secondary,
  },
  
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  
  progressGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  progressText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  
  goalFooter: {
    flexDirection: 'row',
  },
  
  deadlineBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
  },
  
  goalDeadline: {
    fontSize: 13,
    color: theme.color.primary,
    fontWeight: '600',
  },
  
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  
  habitCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.xs * 2) / 2,
    margin: theme.spacing.xs,
    padding: theme.spacing.lg,
    borderRadius: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  
  habitName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: theme.spacing.xs,
  },
  
  habitSchedule: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  postCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 20,
  },
  
  postContent: {
    fontSize: 16,
    color: theme.color.text.primary,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  postTimestamp: {
    fontSize: 13,
    color: theme.color.text.tertiary,
  },
  
  postReactions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  
  reactionEmoji: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  
  reactionCount: {
    fontSize: 14,
    color: theme.color.text.primary,
    fontWeight: '600',
  },
  
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
})