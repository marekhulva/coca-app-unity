import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { theme } from '../themes/theme'

const { width, height } = Dimensions.get('window')

interface MatrixRainProps {
  style?: any
  numberOfColumns?: number
  speed?: number
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  style,
  numberOfColumns = 20,
  speed = 100,
}) => {
  const characters = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const columnWidth = width / numberOfColumns
  
  // Create animated values for each column
  const columns = useRef(
    Array(numberOfColumns).fill(0).map(() => ({
      animValue: new Animated.Value(0),
      chars: Array(30).fill(0).map(() => 
        characters.charAt(Math.floor(Math.random() * characters.length))
      ),
    }))
  ).current

  useEffect(() => {
    // Start animations for each column with random delays
    columns.forEach((column, index) => {
      const randomDelay = Math.random() * 2000
      
      const animate = () => {
        column.animValue.setValue(0)
        Animated.timing(column.animValue, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
          delay: randomDelay,
        }).start(() => {
          // Randomize characters for next animation
          column.chars = column.chars.map(() => 
            characters.charAt(Math.floor(Math.random() * characters.length))
          )
          animate()
        })
      }
      
      animate()
    })
  }, [])

  return (
    <View style={[styles.container, style]}>
      {columns.map((column, columnIndex) => (
        <View
          key={columnIndex}
          style={[
            styles.column,
            {
              left: columnIndex * columnWidth,
              width: columnWidth,
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: column.animValue.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [{
                translateY: column.animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height * 0.5, height * 1.5],
                }),
              }],
            }}
          >
            {column.chars.map((char, charIndex) => (
              <Text
                key={charIndex}
                style={[
                  styles.character,
                  {
                    opacity: 1 - (charIndex / column.chars.length),
                    fontSize: 14 + Math.random() * 4,
                  },
                ]}
              >
                {char}
              </Text>
            ))}
          </Animated.View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  
  column: {
    position: 'absolute',
    top: 0,
    height: height * 2,
  },
  
  character: {
    color: theme.color.primary,
    fontFamily: theme.font.family.mono,
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: theme.color.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
})