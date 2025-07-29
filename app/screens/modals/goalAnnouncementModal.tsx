import React from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { GlassCard } from '../../components/GlassCard'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'

export const GoalAnnouncementModal: React.FC = () => {
  const {
    showGoalAnnouncement,
    selectedGoal,
    goalDeadline,
    user,
    feedPosts,
    finishSetup,
  } = useAppStore()

  const handleAnnounce = () => {
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type: 'goal_announcement' as const,
      content: `I'm committing to ${selectedGoal}! Join me on this journey 🚀`,
      goalTitle: selectedGoal,
      timestamp: new Date(),
      reactions: {},
    }
    
    useAppStore.setState({
      feedPosts: [newPost, ...feedPosts],
    })
    
    finishSetup()
  }

  const handleKeepQuiet = () => {
    finishSetup()
  }

  return (
    <Modal
      visible={showGoalAnnouncement}
      onClose={handleKeepQuiet}
      title="Share Your Goal?"
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        
        <Text style={styles.headline}>
          You're ready to start your journey!
        </Text>
        
        <GlassCard variant="light" padding="lg" style={styles.goalCard}>
          <Text style={styles.goalLabel}>Your Goal</Text>
          <Text style={styles.goalTitle}>{selectedGoal}</Text>
          <Text style={styles.goalDeadline}>
            Target: {goalDeadline.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </GlassCard>
        
        <Text style={styles.description}>
          Sharing your goal publicly increases your chances of success by 65%
        </Text>

        <View style={styles.footer}>
          <Button
            title="Keep it Quiet"
            variant="outline"
            size="lg"
            onPress={handleKeepQuiet}
            style={styles.footerButton}
          />
          <Button
            title="Announce It!"
            variant="primary"
            size="lg"
            onPress={handleAnnounce}
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  
  headline: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  goalCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  
  goalLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  goalTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  goalDeadline: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
  },
  
  description: {
    fontSize: theme.font.size.md,
    color: theme.color.text.secondary,
    textAlign: 'center',
    lineHeight: theme.font.size.md * 1.5,
    marginBottom: theme.spacing.xl,
  },
  
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  
  footerButton: {
    flex: 1,
  },
})