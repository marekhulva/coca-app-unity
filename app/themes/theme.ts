// Import Matrix theme
import { matrixTheme } from './theme.matrix'

// To use Matrix theme, uncomment the line below:
// export const theme = matrixTheme

// ACTIVE THEME: ORIGINAL
export const theme = {
  color: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
      glass: 'rgba(255, 255, 255, 0.7)',
      darkGlass: 'rgba(0, 0, 0, 0.3)',
    },
    
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#8E8E93',
      inverse: '#FFFFFF',
      placeholder: '#C7C7CC',
    },
    
    border: {
      light: '#E5E5EA',
      default: '#C7C7CC',
      dark: '#48484A',
      glass: 'rgba(255, 255, 255, 0.3)',
    },
    
    glass: {
      light: 'rgba(255, 255, 255, 0.7)',
      medium: 'rgba(255, 255, 255, 0.5)',
      dark: 'rgba(0, 0, 0, 0.3)',
      blur: 'rgba(255, 255, 255, 0.1)',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 36,
    full: 9999,
  },
  
  font: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 48,
      display: 56,
    },
    
    weight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
    },
    
    family: {
      regular: 'System',
      mono: 'Courier',
    },
  },
  
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2.0,
      elevation: 1,
    },
    
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8.0,
      elevation: 3,
    },
    
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 16.0,
      elevation: 5,
    },
    
    xl: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.15,
      shadowRadius: 24.0,
      elevation: 10,
    },
    
    glass: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20.0,
      elevation: 8,
    },
  },
  
  gradient: {
    primary: ['#007AFF', '#5856D6'],
    secondary: ['#5856D6', '#BF5AF2'],
    success: ['#34C759', '#30D158'],
    warm: ['#FF9500', '#FF3B30'],
    cool: ['#5AC8FA', '#007AFF'],
    glass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.4)'],
    darkGlass: ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.2)'],
    // New vibrant gradients
    vibrant: ['#FF006E', '#8338EC', '#3A86FF'],
    sunset: ['#FF006E', '#FF8E53'],
    aurora: ['#00C9FF', '#92FE9D'],
    cosmic: ['#667EEA', '#764BA2', '#F093FB'],
    fire: ['#F83600', '#F9D423'],
  },
  
  blur: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
} as const

export type Theme = typeof theme