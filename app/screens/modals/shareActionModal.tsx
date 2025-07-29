import React from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { GlassCard } from '../../components/GlassCard'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'

export const ShareActionModal: React.FC = () => {
  const {
    showShareModal,
    shareAction,
    sharePrivacy,
    shareNote,
    setSharePrivacy,
    setShareNote,
    handleShareAction,
  } = useAppStore((state) => ({
    showShareModal: state.showShareModal,
    shareAction: state.shareAction,
    sharePrivacy: state.sharePrivacy,
    shareNote: state.shareNote,
    setSharePrivacy: (privacy: 'group' | 'private') => state.sharePrivacy = privacy,
    setShareNote: (note: string) => state.shareNote = note,
    handleShareAction: state.handleShareAction,
  }))

  const handleClose = () => {
    useAppStore.setState({ 
      showShareModal: false, 
      shareAction: null,
      shareNote: '',
    })
  }

  if (!shareAction) return null

  return (
    <Modal
      visible={showShareModal}
      onClose={handleClose}
      title="Share Your Progress"
    >
      <View style={styles.content}>
        <GlassCard variant="light" padding="md" style={styles.actionCard}>
          <Text style={styles.actionLabel}>Completed Action</Text>
          <Text style={styles.actionName}>{shareAction.name}</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>Share with:</Text>
        
        <View style={styles.privacyOptions}>
          <Button
            title="Group"
            variant={sharePrivacy === 'group' ? 'primary' : 'outline'}
            size="md"
            onPress={() => setSharePrivacy('group')}
            style={styles.privacyButton}
          />
          <Button
            title="Keep Private"
            variant={sharePrivacy === 'private' ? 'primary' : 'outline'}
            size="md"
            onPress={() => setSharePrivacy('private')}
            style={styles.privacyButton}
          />
        </View>

        {sharePrivacy === 'group' && (
          <TextField
            placeholder="Add a note (optional)"
            value={shareNote}
            onChangeText={setShareNote}
            multiline
            numberOfLines={3}
            variant="glass"
            style={styles.noteField}
          />
        )}

        <View style={styles.footer}>
          <Button
            title="Cancel"
            variant="outline"
            size="lg"
            onPress={handleClose}
            style={styles.footerButton}
          />
          <Button
            title="Complete"
            variant="primary"
            size="lg"
            onPress={() => {
              handleShareAction()
              handleClose()
            }}
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.spacing.md,
  },
  
  actionCard: {
    marginBottom: theme.spacing.lg,
  },
  
  actionLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  
  actionName: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
  },
  
  sectionTitle: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  privacyOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  
  privacyButton: {
    flex: 1,
  },
  
  noteField: {
    marginBottom: theme.spacing.lg,
  },
  
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  
  footerButton: {
    flex: 1,
  },
})