import React, { useRef, useEffect } from 'react'
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
import { GlassButton } from '../components/GlassButton'
import { GlassCard } from '../components/GlassCard'
import { ScreenLayout } from '../layouts/ScreenLayout'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'
import * as Haptics from 'expo-haptics'

export const HomeScreen: React.FC = () => {
  const { user, activities, incrementActivityCount } = useAppStore()
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const cardAnims = useRef(
    activities.map(() => new Animated.Value(0))
  ).current

  useEffect(() => {
    // Entrance animations
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

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start()
    })
  }, [])

  const handleActivityPress = async (activityId: string, index: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    
    // Bounce animation
    Animated.sequence([
      Animated.timing(cardAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnims[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start()

    incrementActivityCount(activityId)
  }

  return (
    <ScreenLayout gradient={theme.gradient.aurora}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Animated.View style={[styles.header, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <GlassCard variant="dark" intensity={95} padding="lg" style={styles.statsCard}>
            <LinearGradient
              colors={theme.gradient.vibrant}
              style={styles.statsGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.cardTitle}>Today's Stats ✨</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Animated.View
                  style={[
                    styles.statCircle,
                    {
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
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
                </Animated.View>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Animated.View
                  style={[
                    styles.statCircle,
                    {
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={theme.gradient.fire}
                    style={styles.statGradient}
                  >
                    <Text style={styles.statValue}>{user.totalPoints}</Text>
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              style={{
                opacity: cardAnims[index],
                transform: [
                  {
                    translateY: cardAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  { scale: cardAnims[index] },
                ],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleActivityPress(activity.id, index)}
              >
                <GlassCard
                  variant="light"
                  intensity={90}
                  padding="md"
                  style={styles.activityCard}
                >
                  <View style={styles.activityContent}>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                    </View>
                    <Animated.View
                      style={[
                        styles.countBadge,
                        {
                          transform: [{
                            scale: cardAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1],
                            }),
                          }],
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={theme.gradient.vibrant}
                        style={styles.countGradient}
                      >
                        <Text style={styles.countText}>{activity.count}</Text>
                      </LinearGradient>
                    </Animated.View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={[
            styles.buttonSection,
            {
              opacity: fadeAnim,
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              }],
            },
          ]}
        >
          <GlassButton
            title="Start New Activity"
            gradient={theme.gradient.vibrant}
            variant="solid"
            size="lg"
            fullWidth
            onPress={() => console.log('Start new activity')}
          />
          <GlassButton
            title="View All Stats"
            variant="glass"
            size="lg"
            fullWidth
            onPress={() => console.log('View all stats')}
            style={styles.secondaryButton}
          />
        </Animated.View>
      </Animated.ScrollView>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  header: {
    marginBottom: theme.spacing.xl,
  },
  
  welcomeText: {
    fontSize: theme.font.size.lg,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  userName: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.color.text.primary,
    letterSpacing: -1,
  },
  
  statsCard: {
    marginBottom: theme.spacing.xl,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  
  statsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  
  cardTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  
  statGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
  },
  
  statLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    fontWeight: '600',
  },
  
  section: {
    marginBottom: theme.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  activityCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 20,
  },
  
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  activityInfo: {
    flex: 1,
  },
  
  activityName: {
    fontSize: theme.font.size.lg,
    fontWeight: '600',
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  activityDescription: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  countBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginLeft: theme.spacing.md,
  },
  
  countGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  countText: {
    color: 'white',
    fontWeight: '700',
    fontSize: theme.font.size.lg,
  },
  
  buttonSection: {
    marginTop: theme.spacing.xl,
  },
  
  secondaryButton: {
    marginTop: theme.spacing.md,
  },
})