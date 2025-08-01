// Vibrant Theme - As shown in ARCHITECTURE.md
export const vibrantTheme = {
  color: {
    primary: '#FF006E',
    secondary: '#8338EC',
    tertiary: '#3A86FF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F7',
      tertiary: '#E5E5E7',
      glass: 'rgba(255, 255, 255, 0.7)',
      darkGlass: 'rgba(0, 0, 0, 0.3)',
    },
    
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
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
      dark: 'rgba(0, 0, 0, 0.5)',
      blur: 'rgba(255, 255, 255, 0.1)',
    },
  },
  
  gradient: {
    vibrant: ['#FF006E', '#8338EC', '#3A86FF'],
    sunset: ['#FF006E', '#FF8E53'],
    aurora: ['#00C9FF', '#92FE9D'],
    cosmic: ['#667EEA', '#764BA2', '#F093FB'],
    fire: ['#F83600', '#F9D423'],
    glass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.4)'],
    darkGlass: ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.2)'],
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
    xl: 24,
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
      xxxl: 40,
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
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
}