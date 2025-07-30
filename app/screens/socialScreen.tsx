import React, { useState, useRef, useEffect } from 'react'
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
import { PromptCarousel } from '../components/PromptCarousel'
import { QuickCompose } from '../components/QuickCompose'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../themes/theme'
import { useAppStore } from '../state/appStore'
import { Prompt } from '../constants/prompts'

const { width } = Dimensions.get('window')

export const SocialScreen: React.FC = () => {
  const { 
    feedPosts, 
    user,
    handleReaction,
    setCurrentScreen,
  } = useAppStore()
  
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })


  const renderPost = (post: typeof feedPosts[0], index: number) => {
    const animatedValue = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start()
    }, [])

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    })

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })
    
    return (
      <Animated.View
        key={post.id}
        style={[
          styles.postWrapper,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <GlassCard
          variant="light"
          intensity={90}
          padding="lg"
          style={styles.postCard}
        >
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#FF006E', '#8338EC']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatar}>{post.userAvatar}</Text>
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.timestamp}>
                  {new Date(post.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreIcon}>•••</Text>
            </TouchableOpacity>
          </View>
          
          {post.type === 'goal_announcement' && (
            <LinearGradient
              colors={['#FF006E', '#8338EC']}
              style={styles.goalBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.goalBadgeText}>🎯 New Goal</Text>
            </LinearGradient>
          )}
          
          {post.type === 'prompted' && post.promptId && (
            <View style={styles.promptBadge}>
              <Text style={styles.promptBadgeText}>
                {post.promptEmoji} {post.promptId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
              </Text>
            </View>
          )}
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          {post.goalTitle && (
            <View style={styles.goalContainer}>
              <LinearGradient
                colors={['rgba(255, 0, 110, 0.1)', 'rgba(131, 56, 236, 0.1)']}
                style={styles.goalGradient}
              >
                <Text style={styles.goalTitle}>{post.goalTitle}</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={['#FF006E', '#8338EC']}
                      style={[styles.progressFill, { width: '0%' }]}
                    />
                  </View>
                  <Text style={styles.progressText}>Day 0</Text>
                </View>
              </LinearGradient>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.reactionsContainer}>
            <View style={styles.reactions}>
              {Object.entries(post.reactions).map(([emoji, count]) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionPill}
                  onPress={() => handleReaction(post.id, emoji)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                  <Text style={styles.reactionCount}>{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.actionButtons}>
              {['🔥', '💪', '❤️', '🎯'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.actionButton}
                  onPress={() => handleReaction(post.id, emoji)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.actionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF006E', '#8338EC', '#3A86FF']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.View style={[
          styles.header,
          {
            transform: [{ scale: headerScale }],
            opacity: headerOpacity,
          }
        ]}>
          <Text style={styles.title}>Community</Text>
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => setCurrentScreen('daily')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC']}
              style={styles.checkInGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.checkInText}>Check In</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={{ opacity: fadeAnim }}
        >
          <PromptCarousel 
            onPromptSelect={setSelectedPrompt}
            selectedPromptId={selectedPrompt?.id || null}
          />
          
          <QuickCompose 
            selectedPrompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
          
          <View style={styles.feedContainer}>
            {feedPosts.map((post, index) => renderPost(post, index))}
          </View>
          
          <View style={{ height: 100 }} />
        </Animated.ScrollView>
      </SafeAreaView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
    opacity: 0.15,
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
  
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.color.text.primary,
    letterSpacing: -0.5,
  },
  
  checkInButton: {
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  
  checkInGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  checkInText: {
    color: theme.color.text.inverse,
    fontWeight: '700',
    fontSize: 15,
  },
  
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  
  
  feedContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  
  postWrapper: {
    marginBottom: theme.spacing.md,
  },
  
  postCard: {
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  avatar: {
    fontSize: 24,
  },
  
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.text.primary,
    marginBottom: 2,
  },
  
  timestamp: {
    fontSize: 13,
    color: theme.color.text.tertiary,
  },
  
  moreButton: {
    padding: theme.spacing.xs,
  },
  
  moreIcon: {
    fontSize: 20,
    color: theme.color.text.tertiary,
    fontWeight: 'bold',
  },
  
  goalBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.sm,
  },
  
  goalBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  
  promptBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.color.glass.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  
  promptBadgeText: {
    color: theme.color.text.secondary,
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.medium,
  },
  
  postContent: {
    fontSize: 16,
    color: theme.color.text.primary,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  
  goalContainer: {
    marginBottom: theme.spacing.md,
  },
  
  goalGradient: {
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8338EC',
    marginBottom: theme.spacing.sm,
  },
  
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(131, 56, 236, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  progressText: {
    fontSize: 12,
    color: '#8338EC',
    fontWeight: '600',
  },
  
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: theme.spacing.sm,
    marginHorizontal: -theme.spacing.lg,
  },
  
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  reactions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(131, 56, 236, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  
  reactionEmoji: {
    fontSize: 14,
  },
  
  reactionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8338EC',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  actionEmoji: {
    fontSize: 18,
  },
  
})