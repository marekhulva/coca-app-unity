import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'
import { theme } from '../themes/theme'

let BlurView: any
if (Platform.OS === 'web') {
  BlurView = require('./BlurView.web').BlurView
} else {
  BlurView = require('expo-blur').BlurView
}

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabPress: (tabId: string) => void
  variant?: 'default' | 'glass'
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  variant = 'glass',
}) => {
  const Container = variant === 'glass' ? BlurView : View

  return (
    <Container
      intensity={80}
      tint="light"
      style={[styles.container, styles[variant]]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <View style={[styles.icon, isActive && styles.activeIcon]}>
                {tab.icon}
              </View>
            )}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.md,
  },
  
  default: {
    backgroundColor: theme.color.background.secondary,
  },
  
  glass: {
    backgroundColor: theme.color.glass.light,
  },
  
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  
  activeTab: {
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.md,
    margin: theme.spacing.xs,
  },
  
  icon: {
    marginBottom: theme.spacing.xs,
  },
  
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  
  label: {
    fontSize: theme.font.size.sm,
    color: theme.color.text.secondary,
    fontWeight: theme.font.weight.medium,
  },
  
  activeLabel: {
    color: theme.color.text.inverse,
    fontWeight: theme.font.weight.semibold,
  },
})