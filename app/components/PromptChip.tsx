import React, { useRef } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native'
import { theme } from '../themes/theme'

interface PromptChipProps {
  emoji: string
  title: string
  onPress: () => void
  isSelected?: boolean
  style?: ViewStyle
}

export const PromptChip: React.FC<PromptChipProps> = ({
  emoji,
  title,
  onPress,
  isSelected = false,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          isSelected && styles.selectedChip,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[
          styles.title,
          isSelected && styles.selectedTitle,
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.color.glass.light,
    borderWidth: 1,
    borderColor: theme.color.border.glass,
  },

  selectedChip: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },

  emoji: {
    fontSize: theme.font.size.lg,
    marginRight: theme.spacing.xs,
  },

  title: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.secondary,
  },

  selectedTitle: {
    color: theme.color.text.inverse,
    fontWeight: theme.font.weight.semibold,
  },
})