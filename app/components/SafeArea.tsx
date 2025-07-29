import React from 'react'
import { View, StyleSheet, Platform, SafeAreaView as RNSafeAreaView } from 'react-native'
import { theme } from '../themes/theme'

interface SafeAreaProps {
  children: React.ReactNode
  style?: any
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}

export const SafeArea: React.FC<SafeAreaProps> = ({ 
  children, 
  style,
  edges = ['top', 'bottom'] 
}) => {
  if (Platform.OS === 'web') {
    const paddingTop = edges.includes('top') ? 0 : 0 // Status bar is handled by WebContainer
    const paddingBottom = edges.includes('bottom') ? 34 : 0 // Home indicator space
    
    return (
      <View style={[
        styles.webSafeArea,
        {
          paddingTop,
          paddingBottom,
        },
        style
      ]}>
        {children}
      </View>
    )
  }
  
  return (
    <RNSafeAreaView style={[styles.safeArea, style]}>
      {children}
    </RNSafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.color.background.primary,
  },
  webSafeArea: {
    flex: 1,
    backgroundColor: theme.color.background.primary,
  },
})