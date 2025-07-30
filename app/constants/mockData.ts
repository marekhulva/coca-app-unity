import { UserGoal, UserAction } from '../state/appStore'

// Mock data for development testing
export const MOCK_GOAL: UserGoal = {
  id: 'mock-goal-1',
  title: 'Run a Marathon',
  metric: 'Complete 26.2 miles',
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  why: 'To challenge myself and improve my fitness',
  isPublic: true,
  milestones: [
    {
      name: '5K Run',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      name: 'Half Marathon',
      date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ],
  progress: 25,
  createdAt: new Date(),
}

export const MOCK_ACTIONS: UserAction[] = [
  {
    id: 'action-1',
    goalId: 'mock-goal-1',
    type: 'goal',
    name: 'Morning Run',
    schedule: 'Daily',
  },
  {
    id: 'action-2',
    goalId: 'mock-goal-1',
    type: 'goal',
    name: 'Strength Training',
    schedule: 'Mon, Wed, Fri',
  },
  {
    id: 'habit-1',
    goalId: 'mock-goal-1',
    type: 'performance',
    name: 'Drink 3L Water',
    schedule: 'Daily',
  },
  {
    id: 'habit-2',
    goalId: 'mock-goal-1',
    type: 'performance',
    name: 'Sleep 8 hours',
    schedule: 'Daily',
  },
]

export const MOCK_APP_STATE = {
  appState: 'main' as const,
  currentStep: 0,
  userGoals: [MOCK_GOAL],
  userActions: MOCK_ACTIONS,
}