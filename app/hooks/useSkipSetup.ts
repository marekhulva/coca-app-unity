import { useAppStore } from '../state/appStore'
import { MOCK_APP_STATE } from '../constants/mockData'

/**
 * Custom hook for skipping the setup process during development
 * This hook encapsulates all the business logic for bypassing onboarding
 */
export const useSkipSetup = () => {
  const setState = useAppStore.setState

  const skipSetup = () => {
    // Apply mock data to the app state
    setState(MOCK_APP_STATE)
  }

  return {
    skipSetup,
    isDevMode: __DEV__,
  }
}