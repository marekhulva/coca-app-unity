import { Platform } from 'react-native'

export const injectWebStyles = () => {
  if (Platform.OS !== 'web') return

  const style = document.createElement('style')
  style.textContent = `
    /* Reset and base styles */
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }
    
    body {
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    /* Beautiful gradient background */
    body::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%);
      background-size: 400% 400%;
      animation: gradientShift 20s ease infinite;
      z-index: -1;
    }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Root container */
    #root {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    /* Main app container - iPhone 14 Pro Max dimensions */
    #root > div {
      width: 100%;
      height: 100%;
      max-width: 430px;
      max-height: 932px;
      background: #000;
      position: relative;
      overflow: hidden;
    }
    
    /* Desktop view - show as iPhone */
    @media (min-width: 431px) {
      #root > div {
        border-radius: 46px;
        box-shadow: 
          0 0 0 12px #1a1a1a,
          0 0 80px rgba(0, 0, 0, 0.5),
          0 20px 100px rgba(0, 0, 0, 0.3);
        position: relative;
      }
      
      /* iPhone bezel */
      #root > div::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40%;
        height: 30px;
        background: #000;
        border-radius: 0 0 20px 20px;
        z-index: 10;
      }
    }
    
    /* Navigation container fix */
    #root > div > div {
      width: 100%;
      height: 100%;
      background: white;
      position: relative;
      border-radius: inherit;
      overflow: hidden;
    }
    
    /* Hide scrollbars */
    ::-webkit-scrollbar {
      display: none;
    }
    
    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    /* Prevent input zoom on iOS */
    input, textarea, select {
      font-size: 16px !important;
      -webkit-appearance: none;
      appearance: none;
    }
    
    /* Smooth transitions */
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
    }
    
    /* Fix for React Navigation */
    .react-navigation-stack {
      height: 100%;
    }
    
    /* Ensure modals stay within iPhone container */
    #root > div {
      position: relative !important;
      z-index: 1;
    }
    
    /* Modal fixes for web */
    [data-react-native-modal] {
      position: absolute !important;
      width: 100% !important;
      height: 100% !important;
      max-width: 430px !important;
      max-height: 932px !important;
      border-radius: inherit !important;
      overflow: hidden !important;
    }
    
    /* Backdrop filter support for glass effects */
    @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
      .glass-effect {
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
      }
    }
  `
  
  document.head.appendChild(style)
}