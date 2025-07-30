import React, { useRef, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, Platform, Animated, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAppStore } from '../state/appStore'
import { theme } from '../themes/theme'

let BlurView: any
if (Platform.OS === 'web') {
  BlurView = require('../components/BlurView.web').BlurView
} else {
  BlurView = require('expo-blur').BlurView
}

// Test Screen
import { TestScreen } from '../screens/TestScreen'

// Onboarding Screens
import { GoalSetupScreen } from '../screens/onboarding/goalSetupScreen'
import { PerformanceHabitsScreen } from '../screens/onboarding/performanceHabitsScreen'
import { MilestonesScreen } from '../screens/onboarding/milestonesScreen'
import { ActionsSetupScreen } from '../screens/onboarding/actionsSetupScreen'

// Main App Screens
import { SocialScreen } from '../screens/socialScreen'
import { DailyScreen } from '../screens/dailyScreen'
import { ProgressScreen } from '../screens/progressScreen'
import { ProfileScreen } from '../screens/profileScreen'

// Modals
import { GoalAnnouncementModal } from '../screens/modals/goalAnnouncementModal'
import { DailyReviewModal } from '../screens/modals/dailyReviewModal'

export type RootStackParamList = {
  Onboarding: undefined
  Main: undefined
}

export type OnboardingStackParamList = {
  GoalSetup: undefined
  PerformanceHabits: undefined
  Milestones: undefined
  ActionsSetup: undefined
}

export type MainTabParamList = {
  Social: undefined
  Daily: undefined
  Progress: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

interface TabIconProps {
  icon: string
  focused: boolean
  color: string
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, color }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start()
      })
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [focused])

  return (
    <Animated.View style={[
      styles.iconContainer,
      {
        transform: [
          { scale: scaleAnim },
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      },
    ]}>
      {focused && (
        <LinearGradient
          colors={theme.gradient.vibrant}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <View style={[
        styles.iconInner,
        focused && styles.iconInnerFocused,
      ]}>
        <Text style={[
          styles.iconText,
          { color: focused ? 'white' : color },
        ]}>
          {icon}
        </Text>
      </View>
    </Animated.View>
  )
}

const OnboardingNavigator = () => {
  const currentStep = useAppStore((state) => state.currentStep)
  
  const screens = [
    { name: 'GoalSetup' as const, component: GoalSetupScreen },
    { name: 'PerformanceHabits' as const, component: PerformanceHabitsScreen },
    { name: 'Milestones' as const, component: MilestonesScreen },
    { name: 'ActionsSetup' as const, component: ActionsSetupScreen },
  ]
  
  const currentScreen = screens[currentStep]
  
  return (
    <>
      <OnboardingStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {currentScreen && (
          <OnboardingStack.Screen
            name={currentScreen.name}
            component={currentScreen.component}
          />
        )}
      </OnboardingStack.Navigator>
      <GoalAnnouncementModal />
    </>
  )
}

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView
        intensity={90}
        tint="light"
        style={styles.blurView}
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.tabBarGradient}
      />
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true })
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          const icons = {
            Social: '🌍',
            Daily: '✨',
            Progress: '📈',
            Profile: '👤',
          }

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabIcon
                icon={icons[route.name as keyof typeof icons]}
                focused={isFocused}
                color={options.tabBarInactiveTintColor}
              />
              <Animated.Text style={[
                styles.tabLabel,
                {
                  color: isFocused ? theme.color.primary : theme.color.text.tertiary,
                  fontWeight: isFocused ? '700' : '500',
                },
              ]}>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const MainNavigator = () => {
  const currentScreen = useAppStore((state) => state.currentScreen)
  
  return (
    <>
      <Tab.Navigator
        initialRouteName={currentScreen === 'social' ? 'Social' : 
                        currentScreen === 'daily' ? 'Daily' :
                        currentScreen === 'progress' ? 'Progress' : 'Profile'}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.color.primary,
          tabBarInactiveTintColor: theme.color.text.tertiary,
        }}
      >
        <Tab.Screen
          name="Social"
          component={SocialScreen}
          listeners={{
            tabPress: () => useAppStore.setState({ currentScreen: 'social' }),
          }}
        />
        <Tab.Screen
          name="Daily"
          component={DailyScreen}
          listeners={{
            tabPress: () => useAppStore.setState({ currentScreen: 'daily' }),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          listeners={{
            tabPress: () => useAppStore.setState({ currentScreen: 'progress' }),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={{
            tabPress: () => useAppStore.setState({ currentScreen: 'profile' }),
          }}
        />
      </Tab.Navigator>
      
      <DailyReviewModal />
    </>
  )
}

export const AppNavigator: React.FC = () => {
  const appState = useAppStore((state) => state.appState)
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {appState === 'setup' ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  
  tabBarGradient: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  
  tabBar: {
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: Platform.OS === 'web' ? theme.spacing.lg : theme.spacing.xl,
  },
  
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
  },
  
  iconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  iconInnerFocused: {
    backgroundColor: 'transparent',
  },
  
  iconText: {
    fontSize: 24,
  },
  
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
})