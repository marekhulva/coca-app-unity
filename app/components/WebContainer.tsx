import React, { useEffect } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { theme } from '../themes/theme'

interface WebContainerProps {
  children: React.ReactNode
}

export const WebContainer: React.FC<WebContainerProps> = ({ children }) => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Set up viewport meta tags
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      }
      
      // Add iOS web app meta tags
      const appleMeta = [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ]
      
      appleMeta.forEach(({ name, content }) => {
        let meta = document.querySelector(`meta[name="${name}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('name', name)
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', content)
      })
      
      // Style the body
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.height = '100vh'
      document.body.style.overflow = 'hidden'
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      document.body.style.display = 'flex'
      document.body.style.justifyContent = 'center'
      document.body.style.alignItems = 'center'
      
      // Add custom CSS
      const style = document.createElement('style')
      style.textContent = `
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        #root > div:first-child {
          width: 100%;
          height: 100%;
          max-width: 430px;
          max-height: 932px;
          position: relative;
          background: white;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(0, 0, 0, 0.3);
        }
        
        @media (min-width: 431px) {
          #root > div:first-child {
            border-radius: 40px;
            margin: 20px;
          }
        }
        
        /* Hide scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Fix input focus zoom on iOS */
        input, textarea, select {
          font-size: 16px !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])
  
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.statusBar}>
          <View style={styles.notch} />
        </View>
        <View style={styles.appContent}>
          {children}
        </View>
      </View>
    )
  }
  
  return <>{children}</>
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: theme.color.background.primary,
    position: 'relative',
  },
  
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 47,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    zIndex: 1000,
  },
  
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -90 }],
    width: 180,
    height: 30,
    backgroundColor: '#000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  
  appContent: {
    flex: 1,
    paddingTop: 47,
  },
})