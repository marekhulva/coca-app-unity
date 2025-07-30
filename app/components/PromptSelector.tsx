import React, { useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native'
import { theme } from '../themes/theme'

interface PromptOption {
  id: string
  emoji: string
  label: string
}

interface PromptSelectorProps {
  options: PromptOption[]
  selectedId: string
  onSelect: (id: string) => void
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  const scrollRef = useRef<ScrollView>(null)

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {options.map((option, index) => {
        const isSelected = option.id === selectedId
        const scaleAnim = useRef(new Animated.Value(1)).current

        const handlePress = () => {
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start()
          onSelect(option.id)
        }

        return (
          <Animated.View
            key={option.id}
            style={[
              styles.optionWrapper,
              index === 0 && styles.firstOption,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.option,
                isSelected && styles.selectedOption,
              ]}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
              <Text style={[
                styles.label,
                isSelected && styles.selectedLabel,
              ]}>
                {option.label}
              </Text>
              {isSelected && <View style={styles.indicator} />}
            </TouchableOpacity>
          </Animated.View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: theme.spacing.md,
  },

  container: {
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.xs,
  },

  optionWrapper: {
    marginRight: theme.spacing.xs,
  },

  firstOption: {
    marginLeft: 0,
  },

  option: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.glass.light,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    minWidth: 100,
  },

  selectedOption: {
    backgroundColor: theme.color.background.primary,
    borderColor: theme.color.primary,
  },

  emoji: {
    fontSize: theme.font.size.xl,
    marginBottom: theme.spacing.xs,
  },

  label: {
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.secondary,
    textAlign: 'center',
  },

  selectedLabel: {
    color: theme.color.primary,
    fontWeight: theme.font.weight.semibold,
  },

  indicator: {
    position: 'absolute',
    bottom: -theme.spacing.xs,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.color.primary,
  },
})