import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  SafeAreaView,
} from 'react-native'
import { GlassButton } from '../../components/GlassButton'
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
  } = useAppStore()

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
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={handleClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Share Your Progress</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.content}>
        <GlassCard variant="light" padding="md" style={styles.actionCard}>
          <Text style={styles.actionLabel}>Completed Action</Text>
          <Text style={styles.actionName}>{shareAction.name}</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>Share with:</Text>
        
        <View style={styles.privacyOptions}>
          <TouchableOpacity
            style={[
              styles.privacyButton,
              sharePrivacy === 'group' && styles.privacyButtonActive
            ]}
            onPress={() => setSharePrivacy('group')}
          >
            <Text style={[
              styles.privacyButtonText,
              sharePrivacy === 'group' && styles.privacyButtonTextActive
            ]}>
              Share with Group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.privacyButton,
              sharePrivacy === 'private' && styles.privacyButtonActive
            ]}
            onPress={() => setSharePrivacy('private')}
          >
            <Text style={[
              styles.privacyButtonText,
              sharePrivacy === 'private' && styles.privacyButtonTextActive
            ]}>
              Keep Private
            </Text>
          </TouchableOpacity>
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
          <GlassButton
            title="Cancel"
            variant="outline"
            size="lg"
            onPress={handleClose}
            style={styles.footerButton}
          />
          <GlassButton
            title="Complete"
            variant="solid"
            gradient={theme.gradient.vibrant}
            size="lg"
            onPress={handleShareAction}
            style={styles.footerButton}
          />
        </View>
              </View>
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
    ...Platform.select({
      ios: theme.shadow.xl,
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
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  
  privacyButtonActive: {
    backgroundColor: theme.color.primary,
  },
  
  privacyButtonText: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.secondary,
  },
  
  privacyButtonTextActive: {
    color: theme.color.text.inverse,
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