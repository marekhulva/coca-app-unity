import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native'
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
      transparent
      animationType="slide"
      onRequestClose={handleKeepQuiet}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={handleKeepQuiet}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Share Your Goal?</Text>
                <TouchableOpacity onPress={handleKeepQuiet} style={styles.closeButton}>
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
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
              </ScrollView>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  modalWrapper: {
    width: '100%',
  },
  
  modalContent: {
    backgroundColor: theme.color.background.primary,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    minHeight: 400,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        ...theme.shadow.xl,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
      },
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: 430,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  title: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.color.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeText: {
    fontSize: theme.font.size.xl,
    color: theme.color.text.secondary,
    fontWeight: theme.font.weight.light,
  },
  
  scrollContent: {
    flex: 1,
  },
  
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