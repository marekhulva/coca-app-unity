import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../themes/theme'

export const TestScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coca App</Text>
      <Text style={styles.subtitle}>If you see this, the app is working!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.background.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.color.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.color.text.secondary,
  },
})