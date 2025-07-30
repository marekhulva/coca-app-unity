import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { theme } from '../themes/theme'
import { useSkipSetup } from '../hooks/useSkipSetup'

/**
 * Development-only button to skip the setup process
 * Only visible when __DEV__ is true
 */
export const DevSkipButton: React.FC = () => {
  const { skipSetup, isDevMode } = useSkipSetup()

  if (!isDevMode) {
    return null
  }

  return (
    <TouchableOpacity
      onPress={skipSetup}
      style={styles.button}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>Skip Setup (Dev)</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.color.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)', // Using error color with opacity
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    marginLeft: theme.spacing.md,
  },
  
  text: {
    color: theme.color.error,
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.semibold,
  },
})