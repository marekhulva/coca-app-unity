import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassButton } from '../../components/GlassButton'
import { TextField } from '../../components/TextField'
import { GlassCard } from '../../components/GlassCard'
import { theme } from '../../themes/theme'
import { useAppStore } from '../../state/appStore'
import * as Haptics from 'expo-haptics'

let BlurView: any
if (Platform.OS === 'web') {
  BlurView = require('../../components/BlurView.web').BlurView
} else {
  BlurView = require('expo-blur').BlurView
}

const { height } = Dimensions.get('window')

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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(height)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (showShareModal) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [showShareModal])

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    useAppStore.setState({ 
      showShareModal: false, 
      shareAction: null,
      shareNote: '',
    })
  }

  const handlePrivacyChange = async (privacy: 'group' | 'private') => {
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync()
    }
    setSharePrivacy(privacy)
  }

  if (!shareAction) return null

  return (
    <Modal
      visible={showShareModal}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
          <Animated.View 
            style={[
              styles.modalWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
            pointerEvents="box-none"
          >
            <TouchableOpacity activeOpacity={1}>
              <GlassCard 
                variant="dark" 
                intensity={95} 
                style={styles.modalContent}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.handle} />
                
                <View style={styles.header}>
                  <Text style={styles.title}>Share Your Progress</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <LinearGradient
                      colors={theme.gradient.vibrant}
                      style={styles.closeGradient}
                    >
                      <Text style={styles.closeText}>×</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              
              <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
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
                    <GlassCard variant="light" intensity={85} padding="lg" style={styles.actionCard}>
                      <LinearGradient
                        colors={theme.gradient.aurora}
                        style={styles.actionGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <Text style={styles.actionIcon}>✅</Text>
                      <Text style={styles.actionLabel}>Completed Action</Text>
                      <Text style={styles.actionName}>{shareAction.name}</Text>
                    </GlassCard>
                  </Animated.View>

                <Text style={styles.sectionTitle}>Share with:</Text>
                
                  <Animated.View 
                    style={[
                      styles.privacyOptions,
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
                    <TouchableOpacity
                      style={styles.privacyButton}
                      onPress={() => handlePrivacyChange('group')}
                      activeOpacity={0.8}
                    >
                      {sharePrivacy === 'group' ? (
                        <LinearGradient
                          colors={theme.gradient.vibrant}
                          style={styles.privacyGradient}
                        >
                          <Text style={styles.privacyIcon}>🌍</Text>
                          <Text style={[styles.privacyButtonText, styles.privacyButtonTextActive]}>
                            Share with Group
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.privacyInner}>
                          <Text style={styles.privacyIcon}>🌍</Text>
                          <Text style={styles.privacyButtonText}>
                            Share with Group
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.privacyButton}
                      onPress={() => handlePrivacyChange('private')}
                      activeOpacity={0.8}
                    >
                      {sharePrivacy === 'private' ? (
                        <LinearGradient
                          colors={theme.gradient.vibrant}
                          style={styles.privacyGradient}
                        >
                          <Text style={styles.privacyIcon}>🔒</Text>
                          <Text style={[styles.privacyButtonText, styles.privacyButtonTextActive]}>
                            Keep Private
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.privacyInner}>
                          <Text style={styles.privacyIcon}>🔒</Text>
                          <Text style={styles.privacyButtonText}>
                            Keep Private
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={{
                      opacity: sharePrivacy === 'group' ? fadeAnim : 0,
                      maxHeight: sharePrivacy === 'group' ? 200 : 0,
                    }}
                  >
                    <TextField
                      placeholder="Add a note (optional)"
                      value={shareNote}
                      onChangeText={setShareNote}
                      multiline
                      numberOfLines={3}
                      style={styles.noteField}
                      hint="Share your thoughts with the community"
                    />
                  </Animated.View>

                  <Animated.View 
                    style={[
                      styles.footer,
                      {
                        opacity: fadeAnim,
                        transform: [{
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          }),
                        }],
                      },
                    ]}
                  >
                    <GlassButton
                      title="Cancel"
                      variant="glass"
                      size="lg"
                      onPress={handleClose}
                      style={styles.footerButton}
                    />
                    <GlassButton
                      title="Complete ✓"
                      variant="solid"
                      gradient={theme.gradient.vibrant}
                      size="lg"
                      onPress={handleShareAction}
                      style={styles.footerButton}
                      haptic
                    />
                  </Animated.View>
                </ScrollView>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  modalWrapper: {
    width: '100%',
  },
  
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    minHeight: 400,
    maxHeight: '90%',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
      },
      android: {
        elevation: 20,
      },
      web: {
        maxWidth: 430,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  
  closeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  
  actionCard: {
    marginBottom: theme.spacing.xl,
    borderRadius: 24,
    position: 'relative',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  actionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  
  actionIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  
  actionLabel: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.font.weight.medium,
  },
  
  actionName: {
    fontSize: theme.font.size.xl,
    fontWeight: '700',
    color: theme.color.text.primary,
    textAlign: 'center',
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
    height: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: theme.spacing.xs,
    overflow: 'hidden',
  },
  
  privacyGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  
  privacyInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  
  privacyIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  
  privacyButtonText: {
    fontSize: theme.font.size.md,
    fontWeight: '600',
    color: theme.color.text.secondary,
    textAlign: 'center',
  },
  
  privacyButtonTextActive: {
    color: 'white',
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