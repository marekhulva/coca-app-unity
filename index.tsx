import React, { useEffect } from 'react'
import { AppNavigator } from './app/navigation/appNavigator'
import { injectWebStyles } from './app/utils/webStyles'

export default function App() {
  useEffect(() => {
    injectWebStyles()
  }, [])
  
  return <AppNavigator />
}