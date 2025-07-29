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
import { FREQUENCY_OPTIONS } from '../../constants'

export const ActionsSetupScreen: React.FC = () => {
  const {
    selectedActionType,
    milestones,
    actions,
    selectActionType,
    saveAction,
    addAnotherAction,
    completeSetup,
  } = useAppStore()

  const [actionName, setActionName] = useState('')
  const [actionWhy, setActionWhy] = useState('')
  const [selectedMilestone, setSelectedMilestone] = useState('')
  const [actionDate, setActionDate] = useState(new Date())
  const [selectedFrequency, setSelectedFrequency] = useState<string[]>([])

  const handleSaveAction = () => {
    if (actionName && selectedMilestone) {
      saveAction({
        name: actionName,
        why: actionWhy,
        milestone: selectedMilestone,
        date: selectedActionType === 'one-time' ? actionDate : undefined,
        frequency: selectedActionType === 'commitment' ? selectedFrequency : undefined,
      })
      
      setActionName('')
      setActionWhy('')
      setSelectedMilestone('')
      setActionDate(new Date())
      setSelectedFrequency([])
    }
  }

  const toggleFrequency = (value: string) => {
    if (selectedFrequency.includes(value)) {
      setSelectedFrequency(selectedFrequency.filter(f => f !== value))
    } else {
      setSelectedFrequency([...selectedFrequency, value])
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradient.success}
        style={styles.gradient}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Time for action</Text>
        <Text style={styles.subtitle}>
          Define specific actions to reach your milestones
        </Text>

        {actions.length === 0 ? (
          <>
            <View style={styles.actionTypeContainer}>
              <Button
                title="One-Time Action"
                variant={selectedActionType === 'one-time' ? 'primary' : 'outline'}
                size="lg"
                fullWidth
                onPress={() => selectActionType('one-time')}
                style={styles.typeButton}
              />
              <Button
                title="Commitment"
                variant={selectedActionType === 'commitment' ? 'primary' : 'outline'}
                size="lg"
                fullWidth
                onPress={() => selectActionType('commitment')}
                style={styles.typeButton}
              />
            </View>

            {selectedActionType && (
              <GlassCard variant="light" padding="lg" style={styles.formCard}>
                <TextField
                  label="Action name"
                  placeholder="What will you do?"
                  value={actionName}
                  onChangeText={setActionName}
                  variant="glass"
                />
                
                <TextField
                  label="Why this action?"
                  placeholder="How does this help you progress?"
                  value={actionWhy}
                  onChangeText={setActionWhy}
                  multiline
                  numberOfLines={2}
                  variant="glass"
                />
                
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>For milestone</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.milestoneScroll}
                  >
                    {milestones.map((milestone, index) => (
                      <Button
                        key={index}
                        title={milestone.name}
                        variant={selectedMilestone === milestone.name ? 'primary' : 'outline'}
                        size="sm"
                        onPress={() => setSelectedMilestone(milestone.name)}
                        style={styles.milestoneButton}
                      />
                    ))}
                  </ScrollView>
                </View>
                
                {selectedActionType === 'one-time' ? (
                  <DatePicker
                    label="When will you do this?"
                    value={actionDate}
                    onChange={setActionDate}
                    minimumDate={new Date()}
                  />
                ) : (
                  <View style={styles.frequencyContainer}>
                    <Text style={styles.frequencyLabel}>Frequency</Text>
                    <View style={styles.frequencyGrid}>
                      {FREQUENCY_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          title={option.label}
                          variant={selectedFrequency.includes(option.value) ? 'primary' : 'outline'}
                          size="sm"
                          onPress={() => toggleFrequency(option.value)}
                          style={styles.frequencyButton}
                        />
                      ))}
                    </View>
                  </View>
                )}
                
                <Button
                  title="Save Action"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handleSaveAction}
                  disabled={!actionName || !selectedMilestone}
                  style={styles.saveButton}
                />
              </GlassCard>
            )}
          </>
        ) : (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Your Actions</Text>
            
            {actions.map((action, index) => (
              <GlassCard
                key={index}
                variant="blur"
                padding="md"
                style={styles.actionCard}
              >
                <View style={styles.actionHeader}>
                  <View style={[
                    styles.actionBadge,
                    action.type === 'one-time' ? styles.oneTimeBadge : styles.commitmentBadge
                  ]}>
                    <Text style={styles.badgeText}>
                      {action.type === 'one-time' ? 'One-Time' : 'Commitment'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.actionName}>{action.name}</Text>
                <Text style={styles.actionSchedule}>
                  {action.type === 'one-time' 
                    ? `On ${action.date?.toLocaleDateString()}`
                    : `${action.frequency?.join(', ')}`
                  }
                </Text>
              </GlassCard>
            ))}
            
            <Button
              title="Add Another Action"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={addAnotherAction}
              style={styles.addButton}
            />
            
            <Button
              title="Finish Setup"
              variant="primary"
              size="lg"
              fullWidth
              onPress={completeSetup}
              style={styles.finishButton}
            />
          </View>
        )}
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
  
  actionTypeContainer: {
    marginBottom: theme.spacing.xl,
  },
  
  typeButton: {
    marginBottom: theme.spacing.md,
  },
  
  formCard: {
    marginBottom: theme.spacing.xl,
  },
  
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  
  pickerLabel: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  milestoneScroll: {
    flexGrow: 0,
  },
  
  milestoneButton: {
    marginRight: theme.spacing.sm,
  },
  
  frequencyContainer: {
    marginBottom: theme.spacing.md,
  },
  
  frequencyLabel: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  
  frequencyButton: {
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  
  saveButton: {
    marginTop: theme.spacing.md,
  },
  
  summaryContainer: {
    marginTop: theme.spacing.lg,
  },
  
  summaryTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
  },
  
  actionCard: {
    marginBottom: theme.spacing.md,
  },
  
  actionHeader: {
    marginBottom: theme.spacing.sm,
  },
  
  actionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  
  oneTimeBadge: {
    backgroundColor: theme.color.info,
  },
  
  commitmentBadge: {
    backgroundColor: theme.color.secondary,
  },
  
  badgeText: {
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.inverse,
  },
  
  actionName: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  actionSchedule: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  addButton: {
    marginBottom: theme.spacing.md,
  },
  
  finishButton: {
    marginTop: theme.spacing.sm,
  },
})