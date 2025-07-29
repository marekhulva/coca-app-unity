import React from 'react'
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native'
import { theme } from '../themes/theme'

let BlurView: any
if (Platform.OS === 'web') {
  BlurView = require('./BlurView.web').BlurView
} else {
  BlurView = require('expo-blur').BlurView
}

interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={styles.backdrop}
      >
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContent}>
            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {children}
          </View>
        </SafeAreaView>
      </BlurView>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  
  safeArea: {
    backgroundColor: 'transparent',
  },
  
  modalContent: {
    backgroundColor: theme.color.background.primary,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    minHeight: 200,
    ...theme.shadow.xl,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  title: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.color.glass.blur,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeText: {
    fontSize: theme.font.size.lg,
    color: theme.color.text.secondary,
  },
})