import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { DatePicker } from '../../components/DatePicker'
import { GlassCard } from '../../components/GlassCard'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'

export const MilestonesScreen: React.FC = () => {
  const {
    selectedGoal,
    goalDeadline,
    goalWhy,
    milestones,
    addMilestone,
    completeMilestones,
  } = useAppStore()

  const [milestoneName, setMilestoneName] = useState('')
  const [milestoneMetric, setMilestoneMetric] = useState('')
  const [milestoneDate, setMilestoneDate] = useState(new Date())

  const handleAddMilestone = () => {
    if (milestoneName && milestoneMetric && milestoneDate) {
      addMilestone({
        name: milestoneName,
        metric: milestoneMetric,
        date: milestoneDate,
      })
      setMilestoneName('')
      setMilestoneMetric('')
      setMilestoneDate(new Date())
    }
  }

  const sortedMilestones = [...milestones].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  )

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient.warm}
        style={styles.gradient}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Break it down</Text>
        <Text style={styles.subtitle}>
          Create milestones to track your journey
        </Text>

        <GlassCard variant="light" padding="lg" style={styles.contextCard}>
          <Text style={styles.contextLabel}>Your Goal</Text>
          <Text style={styles.contextGoal}>{selectedGoal}</Text>
          {goalWhy && (
            <>
              <Text style={styles.contextLabel}>Your Why</Text>
              <Text style={styles.contextWhy}>{goalWhy}</Text>
            </>
          )}
          <Text style={styles.contextLabel}>Target Date</Text>
          <Text style={styles.contextDate}>
            {goalDeadline.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </GlassCard>

        <GlassCard variant="light" padding="lg" style={styles.formCard}>
          <Text style={styles.formTitle}>Add Milestone</Text>
          
          <TextField
            placeholder="Milestone name"
            value={milestoneName}
            onChangeText={setMilestoneName}
            variant="glass"
          />
          
          <TextField
            placeholder="How will you measure it?"
            value={milestoneMetric}
            onChangeText={setMilestoneMetric}
            variant="glass"
          />
          
          <DatePicker
            placeholder="Target date"
            value={milestoneDate}
            onChange={setMilestoneDate}
            minimumDate={new Date()}
            maximumDate={goalDeadline}
          />
          
          <Button
            title="Add Milestone"
            variant="secondary"
            size="md"
            fullWidth
            onPress={handleAddMilestone}
            disabled={!milestoneName || !milestoneMetric}
          />
        </GlassCard>

        {sortedMilestones.length > 0 && (
          <View style={styles.timeline}>
            <Text style={styles.timelineTitle}>Your Journey</Text>
            
            {sortedMilestones.map((milestone, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineCircle} />
                  {index < sortedMilestones.length && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                
                <GlassCard
                  variant="blur"
                  padding="md"
                  style={styles.milestoneCard}
                >
                  <Text style={styles.milestoneName}>{milestone.name}</Text>
                  <Text style={styles.milestoneMetric}>{milestone.metric}</Text>
                  <Text style={styles.milestoneDate}>
                    {milestone.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </GlassCard>
              </View>
            ))}
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineCircle, styles.finalCircle]}>
                  <Text style={styles.trophyEmoji}>🏆</Text>
                </View>
              </View>
              
              <GlassCard
                variant="blur"
                padding="md"
                style={[styles.milestoneCard, styles.finalCard]}
              >
                <Text style={styles.milestoneName}>{selectedGoal}</Text>
                <Text style={styles.milestoneDate}>
                  {goalDeadline.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </GlassCard>
            </View>
          </View>
        )}

        <Button
          title="Continue"
          variant="primary"
          size="lg"
          fullWidth
          onPress={completeMilestones}
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
  
  contextCard: {
    marginBottom: theme.spacing.lg,
  },
  
  contextLabel: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  contextGoal: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  contextWhy: {
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  contextDate: {
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
  },
  
  formCard: {
    marginBottom: theme.spacing.xl,
  },
  
  formTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  timeline: {
    marginBottom: theme.spacing.xl,
  },
  
  timelineTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  
  timelineCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.color.primary,
  },
  
  timelineLine: {
    position: 'absolute',
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: theme.color.border.light,
  },
  
  finalCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.color.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  trophyEmoji: {
    fontSize: 20,
  },
  
  milestoneCard: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  
  finalCard: {
    borderWidth: 2,
    borderColor: theme.color.warning,
  },
  
  milestoneName: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  milestoneMetric: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  milestoneDate: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
  },
  
  continueButton: {
    marginTop: theme.spacing.md,
  },
})