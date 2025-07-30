// Matrix Theme - The Digital Rain
export const matrixTheme = {
  color: {
    primary: '#00FF41',        // Matrix green
    secondary: '#008F11',      // Darker green
    success: '#00FF41',
    warning: '#FFD700',        // Gold for important elements
    error: '#FF0000',
    info: '#00FFFF',          // Cyan accent
    
    background: {
      primary: '#000000',      // Pure black
      secondary: '#0A0A0A',    // Near black
      tertiary: '#0D0208',     // Matrix dark
      glass: 'rgba(0, 255, 65, 0.1)',
      darkGlass: 'rgba(0, 0, 0, 0.8)',
    },
    
    text: {
      primary: '#00FF41',      // Matrix green
      secondary: '#00CC33',    // Slightly darker green
      tertiary: '#008F11',     // Even darker green
      inverse: '#000000',
      placeholder: '#005500',  // Very dark green
    },
    
    border: {
      light: 'rgba(0, 255, 65, 0.2)',
      default: 'rgba(0, 255, 65, 0.4)',
      dark: 'rgba(0, 255, 65, 0.6)',
      glass: 'rgba(0, 255, 65, 0.3)',
    },
    
    glass: {
      light: 'rgba(0, 255, 65, 0.05)',
      medium: 'rgba(0, 255, 65, 0.1)',
      dark: 'rgba(0, 0, 0, 0.9)',
      blur: 'rgba(0, 255, 65, 0.02)',
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
    sm: 2,      // More angular for Matrix feel
    md: 4,
    lg: 8,
    xl: 12,
    xxl: 16,
    xxxl: 20,
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
      mono: 'Courier New',  // Matrix uses monospace
    },
  },
  
  shadow: {
    sm: {
      shadowColor: '#00FF41',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2.0,
      elevation: 1,
    },
    
    md: {
      shadowColor: '#00FF41',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 8.0,
      elevation: 3,
    },
    
    lg: {
      shadowColor: '#00FF41',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.5,
      shadowRadius: 16.0,
      elevation: 5,
    },
    
    xl: {
      shadowColor: '#00FF41',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.6,
      shadowRadius: 24.0,
      elevation: 10,
    },
    
    glass: {
      shadowColor: '#00FF41',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 20.0,
      elevation: 8,
    },
  },
  
  gradient: {
    // Matrix-themed gradients
    matrix: ['#00FF41', '#008F11', '#003B00'],           // Classic matrix green
    matrixGlow: ['#00FF41', '#00FF41', 'transparent'],   // Glowing effect
    codeStream: ['#003B00', '#00FF41', '#003B00'],       // Vertical code effect
    terminal: ['#000000', '#001100', '#002200'],         // Terminal background
    corruption: ['#00FF41', '#FF0000', '#00FF41'],       // Glitch effect
    encrypted: ['#00FFFF', '#00FF41', '#00FFFF'],        // Encrypted data
    redPill: ['#FF0000', '#8B0000', '#FF0000'],          // Red pill choice
    bluePill: ['#0000FF', '#000080', '#0000FF'],         // Blue pill choice
    
    // Legacy gradients mapped to Matrix style
    primary: ['#00FF41', '#008F11'],
    secondary: ['#008F11', '#005500'],
    success: ['#00FF41', '#00CC33'],
    warm: ['#FFD700', '#FFA500'],
    cool: ['#00FFFF', '#00FF41'],
    glass: ['rgba(0, 255, 65, 0.2)', 'rgba(0, 255, 65, 0.05)'],
    darkGlass: ['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.7)'],
    vibrant: ['#00FF41', '#00FFFF', '#00FF41'],
    sunset: ['#00FF41', '#FFD700'],
    aurora: ['#00FF41', '#00FFFF'],
    cosmic: ['#000000', '#00FF41', '#000000'],
    fire: ['#FF0000', '#FFD700'],
  },
  
  blur: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  animation: {
    fast: 100,      // Faster for Matrix digital feel
    normal: 200,
    slow: 400,
  },
} as const

export type MatrixTheme = typeof matrixTheme