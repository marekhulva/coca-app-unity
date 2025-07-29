import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { GlassCard } from '../../components/GlassCard'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import { DAY_REVIEW_QUESTIONS } from '../../constants'

export const DailyReviewModal: React.FC = () => {
  const {
    showSMSFlow,
    smsStep,
    currentActionIndex,
    userActions,
    checkedActions,
    smsAnswers,
    actionReviewResults,
    nextActionOrStep,
    completeSMS,
  } = useAppStore()

  const [tempAnswer, setTempAnswer] = useState('')
  const [tempCompleted, setTempCompleted] = useState<boolean | null>(null)
  const [tempReason, setTempReason] = useState('')

  const missedActions = useMemo(() => {
    return userActions.filter(action => !checkedActions[action.id])
  }, [userActions, checkedActions])

  const currentAction = missedActions[currentActionIndex]
  const currentQuestion = DAY_REVIEW_QUESTIONS[smsStep - 1]

  const handleActionReview = () => {
    if (tempCompleted !== null) {
      useAppStore.setState((state) => ({
        actionReviewResults: {
          ...state.actionReviewResults,
          [currentAction.id]: {
            completed: tempCompleted,
            reason: tempCompleted ? undefined : tempReason,
          },
        },
      }))
      
      setTempCompleted(null)
      setTempReason('')
      nextActionOrStep()
    }
  }

  const handleQuestionAnswer = () => {
    if (tempAnswer || currentQuestion?.type === 'boolean') {
      useAppStore.setState((state) => ({
        smsAnswers: [
          ...state.smsAnswers,
          {
            question: currentQuestion.question,
            answer: tempAnswer,
          },
        ],
      }))
      
      setTempAnswer('')
      
      if (smsStep < DAY_REVIEW_QUESTIONS.length) {
        nextActionOrStep()
      } else {
        completeSMS()
      }
    }
  }

  const renderContent = () => {
    if (smsStep === 0 && currentAction) {
      return (
        <View style={styles.content}>
          <Text style={styles.stepTitle}>Action Review</Text>
          
          <GlassCard variant="light" padding="md" style={styles.actionCard}>
            <Text style={styles.actionName}>{currentAction.name}</Text>
            <Text style={styles.actionSchedule}>{currentAction.schedule}</Text>
          </GlassCard>
          
          <Text style={styles.question}>Did you complete this action?</Text>
          
          <View style={styles.booleanOptions}>
            <Button
              title="Yes"
              variant={tempCompleted === true ? 'primary' : 'outline'}
              size="lg"
              onPress={() => setTempCompleted(true)}
              style={styles.optionButton}
            />
            <Button
              title="No"
              variant={tempCompleted === false ? 'primary' : 'outline'}
              size="lg"
              onPress={() => setTempCompleted(false)}
              style={styles.optionButton}
            />
          </View>
          
          {tempCompleted === false && (
            <TextField
              label="What prevented you?"
              placeholder="Be honest with yourself..."
              value={tempReason}
              onChangeText={setTempReason}
              multiline
              numberOfLines={3}
              variant="glass"
            />
          )}
          
          <Button
            title="Next"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleActionReview}
            disabled={tempCompleted === null}
            style={styles.continueButton}
          />
        </View>
      )
    }

    if (currentQuestion) {
      return (
        <View style={styles.content}>
          <Text style={styles.stepTitle}>
            Daily Review ({smsStep}/{DAY_REVIEW_QUESTIONS.length})
          </Text>
          
          <Text style={styles.question}>{currentQuestion.question}</Text>
          
          {currentQuestion.type === 'scale' && (
            <View style={styles.scaleOptions}>
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option}
                  title={option}
                  variant={tempAnswer === option ? 'primary' : 'outline'}
                  size="md"
                  onPress={() => setTempAnswer(option)}
                  style={styles.scaleButton}
                />
              ))}
            </View>
          )}
          
          {currentQuestion.type === 'boolean' && (
            <View style={styles.booleanOptions}>
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option}
                  title={option}
                  variant={tempAnswer === option ? 'primary' : 'outline'}
                  size="lg"
                  onPress={() => setTempAnswer(option)}
                  style={styles.optionButton}
                />
              ))}
            </View>
          )}
          
          {currentQuestion.type === 'text' && (
            <TextField
              placeholder="Your answer..."
              value={tempAnswer}
              onChangeText={setTempAnswer}
              multiline
              numberOfLines={4}
              variant="glass"
            />
          )}
          
          {currentQuestion.type === 'actions' && (
            <>
              <TextField
                placeholder="What actions will you take tomorrow?"
                value={tempAnswer}
                onChangeText={setTempAnswer}
                multiline
                numberOfLines={4}
                variant="glass"
              />
              <Text style={styles.hint}>
                Be specific and actionable
              </Text>
            </>
          )}
          
          <Button
            title={smsStep === DAY_REVIEW_QUESTIONS.length ? "Complete" : "Next"}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleQuestionAnswer}
            disabled={!tempAnswer && currentQuestion.type !== 'boolean'}
            style={styles.continueButton}
          />
        </View>
      )
    }

    return null
  }

  return (
    <Modal
      visible={showSMSFlow}
      onClose={completeSMS}
      title="Daily Review"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.spacing.md,
  },
  
  stepTitle: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  
  actionCard: {
    marginBottom: theme.spacing.lg,
  },
  
  actionName: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  actionSchedule: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
  },
  
  question: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  
  booleanOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  
  optionButton: {
    flex: 1,
  },
  
  scaleOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  
  scaleButton: {
    minWidth: 80,
  },
  
  hint: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.tertiary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  
  continueButton: {
    marginTop: theme.spacing.xl,
  },
})