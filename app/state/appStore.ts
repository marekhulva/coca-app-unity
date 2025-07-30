import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  todayStreak: number
  totalPoints: number
  avatar?: string
}

export interface PerformanceHabit {
  name: string
  time?: string
  reminder?: boolean
}

export interface Milestone {
  name: string
  metric: string
  date: Date
  completed?: boolean
}

export interface Action {
  type: 'one-time' | 'commitment'
  name: string
  why?: string
  milestone: string
  date?: Date
  frequency?: string[]
}

export interface UserGoal {
  id: string
  title: string
  metric: string
  deadline: Date
  why?: string
  isPublic: boolean
  milestones: Milestone[]
  progress: number
  createdAt: Date
}

export interface UserAction {
  id: string
  goalId: string
  type: 'goal' | 'performance'
  name: string
  schedule?: string
  completed?: boolean
}

export interface FeedPost {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'checkin' | 'goal_announcement' | 'prompted'
  content: string
  timestamp: Date
  reactions: { [emoji: string]: number }
  goalTitle?: string
  promptId?: string
  promptEmoji?: string
}

interface SMSAnswer {
  question: string
  answer: string
}

interface AppState {
  appState: 'setup' | 'main'
  currentStep: number
  currentScreen: 'social' | 'daily' | 'progress' | 'profile'
  
  selectedGoal: string
  goalMetric: string
  goalDeadline: Date
  goalWhy: string
  selectedSharingOption: 'public' | 'private'
  
  performanceHabits: PerformanceHabit[]
  milestones: Milestone[]
  selectedActionType: 'one-time' | 'commitment' | null
  actions: Action[]
  
  user: User
  userGoals: UserGoal[]
  userActions: UserAction[]
  checkedActions: { [actionId: string]: boolean }
  
  feedPosts: FeedPost[]
  progressTab: 'personal' | 'group'
  expandedGoalId: string | null
  
  showShareModal: boolean
  shareAction: UserAction | null
  sharePrivacy: 'group' | 'private'
  shareNote: string
  
  showGoalAnnouncement: boolean
  showSMSFlow: boolean
  smsStep: number
  currentActionIndex: number
  smsAnswers: SMSAnswer[]
  actionReviewResults: { [actionId: string]: { completed: boolean; reason?: string } }
  
  showPostComposer: boolean
  selectedPromptId: string | null
  
  setAppState: (state: 'setup' | 'main') => void
  setCurrentStep: (step: number) => void
  setCurrentScreen: (screen: 'social' | 'daily' | 'progress' | 'profile') => void
  
  setSelectedGoal: (goal: string) => void
  setGoalMetric: (metric: string) => void
  setGoalDeadline: (date: Date) => void
  setGoalWhy: (why: string) => void
  setSelectedSharingOption: (option: 'public' | 'private') => void
  
  togglePerformanceHabit: (habitName: string) => void
  updateHabitTime: (habitName: string, time: string) => void
  toggleHabitReminder: (habitName: string) => void
  
  addMilestone: (milestone: Milestone) => void
  selectActionType: (type: 'one-time' | 'commitment') => void
  saveAction: (action: Omit<Action, 'type'>) => void
  
  lockInGoal: () => void
  completeBoosters: () => void
  completeMilestones: () => void
  addAnotherAction: () => void
  completeSetup: () => void
  
  toggleAction: (actionId: string) => void
  handleReaction: (postId: string, emoji: string) => void
  handleShareAction: () => void
  setSharePrivacy: (privacy: 'group' | 'private') => void
  setShareNote: (note: string) => void
  
  openSMSFlow: () => void
  completeSMS: () => void
  nextActionOrStep: () => void
  
  finishSetup: () => void
  
  openPostComposer: (promptId: string | null) => void
  closePostComposer: () => void
  publishPost: (content: string) => void
}

const initialUser: User = {
  id: '1',
  name: 'Alex',
  email: 'alex@example.com',
  todayStreak: 7,
  totalPoints: 1250,
  avatar: '👤',
}

const mockFeedPosts: FeedPost[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sarah',
    userAvatar: '👩',
    type: 'checkin',
    content: 'Just completed my morning run! Feeling energized 💪',
    timestamp: new Date(Date.now() - 3600000),
    reactions: { '🔥': 5, '👏': 3 },
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike',
    userAvatar: '👨',
    type: 'goal_announcement',
    content: 'Starting my journey to learn Spanish! 🇪🇸',
    goalTitle: 'Learn Spanish',
    timestamp: new Date(Date.now() - 7200000),
    reactions: { '🎯': 7, '💪': 4 },
  },
]

export const useAppStore = create<AppState>((set, get) => ({
  appState: 'setup',
  currentStep: 0,
  currentScreen: 'social',
  
  selectedGoal: '',
  goalMetric: '',
  goalDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  goalWhy: '',
  selectedSharingOption: 'public',
  
  performanceHabits: [],
  milestones: [],
  selectedActionType: null,
  actions: [],
  
  user: initialUser,
  userGoals: [],
  userActions: [],
  checkedActions: {},
  
  feedPosts: mockFeedPosts,
  progressTab: 'personal',
  expandedGoalId: null,
  
  showShareModal: false,
  shareAction: null,
  sharePrivacy: 'group',
  shareNote: '',
  
  showGoalAnnouncement: false,
  showSMSFlow: false,
  smsStep: 0,
  currentActionIndex: 0,
  smsAnswers: [],
  actionReviewResults: {},
  
  showPostComposer: false,
  selectedPromptId: null,
  
  setAppState: (state) => set({ appState: state }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
  setGoalMetric: (metric) => set({ goalMetric: metric }),
  setGoalDeadline: (date) => set({ goalDeadline: date }),
  setGoalWhy: (why) => set({ goalWhy: why }),
  setSelectedSharingOption: (option) => set({ selectedSharingOption: option }),
  
  togglePerformanceHabit: (habitName) => set((state) => {
    const exists = state.performanceHabits.some(h => h.name === habitName)
    if (exists) {
      return {
        performanceHabits: state.performanceHabits.filter(h => h.name !== habitName)
      }
    } else {
      return {
        performanceHabits: [...state.performanceHabits, { name: habitName }]
      }
    }
  }),
  
  updateHabitTime: (habitName, time) => set((state) => ({
    performanceHabits: state.performanceHabits.map(h =>
      h.name === habitName ? { ...h, time } : h
    )
  })),
  
  toggleHabitReminder: (habitName) => set((state) => ({
    performanceHabits: state.performanceHabits.map(h =>
      h.name === habitName ? { ...h, reminder: !h.reminder } : h
    )
  })),
  
  addMilestone: (milestone) => set((state) => ({
    milestones: [...state.milestones, milestone]
  })),
  
  selectActionType: (type) => set({ selectedActionType: type }),
  
  saveAction: (action) => set((state) => ({
    actions: [...state.actions, { ...action, type: state.selectedActionType! }]
  })),
  
  lockInGoal: () => {
    const { selectedGoal, goalMetric, goalDeadline } = get()
    if (selectedGoal && goalMetric && goalDeadline) {
      set({ currentStep: 1 })
    }
  },
  
  completeBoosters: () => set({ currentStep: 2 }),
  completeMilestones: () => set({ currentStep: 3 }),
  addAnotherAction: () => set({ currentStep: 3, selectedActionType: null }),
  
  completeSetup: () => {
    const state = get()
    const newGoal: UserGoal = {
      id: Date.now().toString(),
      title: state.selectedGoal,
      metric: state.goalMetric,
      deadline: state.goalDeadline,
      why: state.goalWhy,
      isPublic: state.selectedSharingOption === 'public',
      milestones: state.milestones,
      progress: 0,
      createdAt: new Date(),
    }
    
    const goalActions: UserAction[] = state.actions.map((action, index) => ({
      id: `action-${Date.now()}-${index}`,
      goalId: newGoal.id,
      type: 'goal',
      name: action.name,
      schedule: action.type === 'one-time' 
        ? action.date?.toLocaleDateString() 
        : action.frequency?.join(', '),
    }))
    
    const habitActions: UserAction[] = state.performanceHabits.map((habit, index) => ({
      id: `habit-${Date.now()}-${index}`,
      goalId: newGoal.id,
      type: 'performance',
      name: habit.name,
      schedule: habit.time || 'Daily',
    }))
    
    set({
      userGoals: [newGoal],
      userActions: [...goalActions, ...habitActions],
      showGoalAnnouncement: state.selectedSharingOption === 'public',
      appState: state.selectedSharingOption === 'public' ? 'setup' : 'main',
    })
  },
  
  toggleAction: (actionId) => {
    const state = get()
    const action = state.userActions.find(a => a.id === actionId)
    
    if (action?.type === 'goal') {
      set({
        shareAction: action,
        showShareModal: true,
      })
    } else {
      set((state) => ({
        checkedActions: {
          ...state.checkedActions,
          [actionId]: !state.checkedActions[actionId]
        }
      }))
    }
  },
  
  handleReaction: (postId, emoji) => set((state) => ({
    feedPosts: state.feedPosts.map(post => {
      if (post.id === postId) {
        const reactions = { ...post.reactions }
        reactions[emoji] = (reactions[emoji] || 0) + 1
        return { ...post, reactions }
      }
      return post
    })
  })),
  
  handleShareAction: () => {
    const state = get()
    if (state.shareAction) {
      // Update checked actions first
      set((prevState) => ({
        checkedActions: {
          ...prevState.checkedActions,
          [state.shareAction!.id]: true
        },
      }))
      
      // Handle group sharing
      if (state.sharePrivacy === 'group') {
        const newPost: FeedPost = {
          id: Date.now().toString(),
          userId: state.user.id,
          userName: state.user.name,
          userAvatar: state.user.avatar,
          type: 'checkin',
          content: state.shareNote || `Completed: ${state.shareAction.name}`,
          timestamp: new Date(),
          reactions: {},
        }
        
        // Add post to feed
        set((prevState) => ({
          feedPosts: [newPost, ...prevState.feedPosts]
        }))
      }
      
      // Clear modal state separately
      set({
        showShareModal: false,
        shareAction: null,
        shareNote: '',
        sharePrivacy: 'group', // Reset to default
      })
    }
  },
  
  setSharePrivacy: (privacy) => set({ sharePrivacy: privacy }),
  setShareNote: (note) => set({ shareNote: note }),
  
  openSMSFlow: () => set({ showSMSFlow: true, smsStep: 0, currentActionIndex: 0 }),
  
  completeSMS: () => set({
    showSMSFlow: false,
    smsStep: 0,
    currentActionIndex: 0,
    smsAnswers: [],
    actionReviewResults: {},
  }),
  
  nextActionOrStep: () => set((state) => {
    const missedActions = state.userActions.filter(
      action => !state.checkedActions[action.id]
    )
    
    if (state.currentActionIndex < missedActions.length - 1) {
      return { currentActionIndex: state.currentActionIndex + 1 }
    } else {
      return { smsStep: state.smsStep + 1, currentActionIndex: 0 }
    }
  }),
  
  finishSetup: () => set({ appState: 'main', showGoalAnnouncement: false }),
  
  openPostComposer: (promptId) => set({ 
    showPostComposer: true, 
    selectedPromptId: promptId 
  }),
  
  closePostComposer: () => set({ 
    showPostComposer: false, 
    selectedPromptId: null 
  }),
  
  publishPost: (content) => {
    const state = get()
    
    const newPost: FeedPost = {
      id: Date.now().toString(),
      userId: state.user.id,
      userName: state.user.name,
      userAvatar: state.user.avatar,
      type: 'prompted',
      content,
      timestamp: new Date(),
      reactions: {},
    }
    
    set({
      feedPosts: [newPost, ...state.feedPosts],
    })
  },
}))