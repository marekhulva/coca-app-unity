import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { theme } from '../themes/theme'

interface ModalPortalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  animationType?: 'slide' | 'fade'
}

export const ModalPortal: React.FC<ModalPortalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(300)).current

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        animationType === 'slide' &&
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }),
      ].filter(Boolean)).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        animationType === 'slide' &&
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }),
      ].filter(Boolean)).start()
    }
  }, [visible, animationType])

  if (!visible) return null

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.contentWrapper}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.content,
              animationType === 'slide' && {
                transform: [{ translateY: slideAnim }],
              },
              animationType === 'fade' && {
                opacity: fadeAnim,
              },
              {
                paddingBottom: theme.spacing.xl,
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  content: {
    backgroundColor: theme.color.background.primary,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    minHeight: 200,
    maxHeight: '90%',
    ...Platform.select({
      ios: theme.shadow.xl,
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
})